import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://backendecombot-production.up.railway.app/api';

function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null); // null = loading, true = authenticated, false = not authenticated
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("access");
      const refresh = localStorage.getItem("refresh");

      // Jika tidak ada token sama sekali
      if (!token) {
        setIsAuth(false);
        setIsLoading(false);
        return;
      }

      try {
        // Verifikasi token ke backend
        const verifyRes = await fetch(
          `${API_BASE}/token/verify/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          }
        );

        if (verifyRes.ok) {
          // Token valid
          setIsAuth(true);
          setIsLoading(false);
          return;
        }

        // Token tidak valid, coba refresh
        if (!refresh) {
          // Tidak ada refresh token
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          setIsAuth(false);
          setIsLoading(false);
          return;
        }

        // Coba refresh token
        const refreshRes = await fetch(
          `${API_BASE}/token/refresh/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh }),
          }
        );

        if (refreshRes.ok) {
          const data = await refreshRes.json();
          localStorage.setItem("access", data.access);
          setIsAuth(true);
        } else {
          // Refresh token juga invalid
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          setIsAuth(false);
        }
      } catch (err) {
        console.error("Token verification error:", err);
        // Jika ada error network atau lainnya, anggap tidak terautentikasi
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setIsAuth(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
    const handleLogout = () => setIsAuth(false);
    window.addEventListener("logout", handleLogout);
    return () => window.removeEventListener("logout", handleLogout);
  }, []);

  // Loading state dengan spinner
  if (isLoading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "var(--bg-light)",
        flexDirection: "column",
        gap: "1rem"
      }}>
        <div style={{
          width: "48px",
          height: "48px",
          border: "4px solid rgba(82, 183, 136, 0.2)",
          borderTop: "4px solid var(--primary)",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }}></div>
        <p style={{ 
          color: "var(--text-dark)", 
          fontSize: "1rem",
          fontWeight: 500 
        }}>
          Memverifikasi akses...
        </p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Redirect ke login jika tidak terautentikasi
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // Render children jika terautentikasi
  return children;
}

export default ProtectedRoute;
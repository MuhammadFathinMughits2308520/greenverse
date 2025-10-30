import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("access");
      const refresh = localStorage.getItem("refresh");

      // Jika tidak ada token sama sekali
      if (!token) {
        console.log('❌ No access token found');
        setIsAuth(false);
        setIsLoading(false);
        return;
      }

      try {
        console.log('🔍 Verifying access token...');
        
        // Verifikasi token ke backend
        const verifyRes = await fetch(`${API_BASE}/token/verify/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (verifyRes.ok) {
          console.log('✅ Access token is valid');
          setIsAuth(true);
          setIsLoading(false);
          return;
        }

        console.log('⚠️ Access token expired, attempting refresh...');

        // Token tidak valid, coba refresh
        if (!refresh) {
          console.log('❌ No refresh token available');
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          setIsAuth(false);
          setIsLoading(false);
          return;
        }

        // Coba refresh token
        const refreshRes = await fetch(`${API_BASE}/token/refresh/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh }),
        });

        if (refreshRes.ok) {
          const data = await refreshRes.json();
          localStorage.setItem("access", data.access);
          
          // Jika backend mengirim refresh token baru, update juga
          if (data.refresh) {
            localStorage.setItem("refresh", data.refresh);
          }
          
          console.log('✅ Token refreshed successfully');
          setIsAuth(true);
        } else {
          console.log('❌ Refresh token invalid or expired');
          
          // Refresh token juga invalid
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          setIsAuth(false);
        }
      } catch (err) {
        console.error("❌ Token verification error:", err);
        
        // Jika ada error network atau lainnya
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setIsAuth(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();

    // Listen untuk logout event
    const handleLogout = () => {
      console.log('👋 Logout event received');
      setIsAuth(false);
    };
    
    // Listen untuk token refresh event dari apiClient
    const handleTokenRefreshed = () => {
      console.log('🔄 Token refreshed event received');
      setIsAuth(true);
    };

    window.addEventListener("logout", handleLogout);
    window.addEventListener("token-refreshed", handleTokenRefreshed);
    
    return () => {
      window.removeEventListener("logout", handleLogout);
      window.removeEventListener("token-refreshed", handleTokenRefreshed);
    };
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
    console.log('🚫 Redirecting to login - user not authenticated');
    return <Navigate to="/login" replace />;
  }

  // Render children jika terautentikasi
  console.log('✅ User authenticated, rendering protected content');
  return children;
}

export default ProtectedRoute;
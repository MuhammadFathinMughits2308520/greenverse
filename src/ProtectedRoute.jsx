import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null); // null = loading

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("access");
      const refresh = localStorage.getItem("refresh");

      if (!token) {
        setIsAuth(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          // token expired → coba refresh
          if (!refresh) {
            setIsAuth(false);
            return;
          }

          const res = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh }),
          });
          const data = await res.json();

          if (data.access) {
            localStorage.setItem("access", data.access);
            setIsAuth(true);
          } else {
            setIsAuth(false);
          }
        } else {
          // token masih valid
          setIsAuth(true);
        }
      } catch (err) {
        setIsAuth(false);
      }
    };

    verifyToken();
  }, []);

  // Saat masih cek token
  if (isAuth === null) {
    return <div>Loading...</div>;
  }

  // Jika belum login / token invalid
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // Kalau token valid
  return children;
}

export default ProtectedRoute;

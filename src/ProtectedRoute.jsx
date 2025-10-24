// import React, { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";

// function ProtectedRoute({ children }) {
//   const [isAuth, setIsAuth] = useState(null); // null = loading

//   useEffect(() => {
//     const verifyToken = async () => {
//       const token = localStorage.getItem("access");
//       const refresh = localStorage.getItem("refresh");

//       if (!token) {
//         setIsAuth(false);
//         return;
//       }

//       try {
//         const decoded = jwtDecode(token);
//         const currentTime = Date.now() / 1000;

//         if (decoded.exp < currentTime) {
//           // token expired → coba refresh
//           if (!refresh) {
//             setIsAuth(false);
//             return;
//           }

//           const res = await fetch("https://backendecombot-production.up.railway.app/api/token/refresh/", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ refresh }),
//           });
//           const data = await res.json();

//           if (data.access) {
//             localStorage.setItem("access", data.access);
//             setIsAuth(true);
//           } else {
//             setIsAuth(false);
//           }
//         } else {
//           // token masih valid
//           setIsAuth(true);
//         }
//       } catch (err) {
//         setIsAuth(false);
//       }
//     };

//     verifyToken();
//   }, []);

//   // Saat masih cek token
//   if (isAuth === null) {
//     return <div>Loading...</div>;
//   }

//   // Jika belum login / token invalid
//   if (!isAuth) {
//     return <Navigate to="/login" replace />;
//   }

//   // Kalau token valid
//   return children;
// }

// export default ProtectedRoute;


import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

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
          "https://backendecombot-production.up.railway.app/api/token/verify/",
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
          "https://backendecombot-production.up.railway.app/api/token/refresh/",
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
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import "../styles/authpage.css";

// function LoginPage() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = localStorage.getItem("access");
//       if (!token) return; // jika belum login, lewati

//       try {
//         // verifikasi token (endpoint JWT verify, bisa disesuaikan)
//         await axios.post(
//           "https://backendecombot-production.up.railway.app/api/token/verify/",
//           { token }
//         );
//         // kalau token valid → langsung masuk ke dashboard
//         navigate("/ecomic");
//       } catch (err) {
//         // token invalid → hapus dari storage
//         localStorage.removeItem("access");
//         localStorage.removeItem("refresh");
//       }
//     };

//     checkAuth();
//   }, [navigate]);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setMessage("");
    
//     try {
//       const res = await axios.post("https://backendecombot-production.up.railway.app/api/login/", {
//         username, password
//       });
//       localStorage.setItem("access", res.data.access);
//       localStorage.setItem("refresh", res.data.refresh);
//       setMessage("Login berhasil! Mengalihkan...");
//       setTimeout(() => {
//         window.location.href = "/ecomic";
//       }, 1000);
//     } catch (err) {
//       setMessage("Login gagal! Periksa username dan password Anda.");
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-wrapper">
//         <div className="auth-card">
//           <div className="auth-header">
//             <div className="auth-logo">
//               <img src="/item/logo.svg" alt="GreenVerse Logo" />
//             </div>
//             <h2 className="auth-title">Selamat Datang</h2>
//             <p className="auth-subtitle">Masuk ke akun ECOMBOT Anda</p>
//           </div>

//           <form onSubmit={handleLogin} className="auth-form">
//             <div className="form-group">
//               <label htmlFor="username">Username</label>
//               <div className="input-wrapper">
//                 <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                 </svg>
//                 <input
//                   id="username"
//                   type="text"
//                   placeholder="Masukkan username"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   required
//                   autoComplete="username"
//                 />
//               </div>
//             </div>

//             <div className="form-group">
//               <label htmlFor="password">Password</label>
//               <div className="input-wrapper">
//                 <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                 </svg>
//                 <input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Masukkan password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   autoComplete="current-password"
//                 />
//                 <button
//                   type="button"
//                   className="toggle-password"
//                   onClick={() => setShowPassword(!showPassword)}
//                   aria-label={showPassword ? "Hide password" : "Show password"}
//                 >
//                   {showPassword ? (
//                     <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                     </svg>
//                   ) : (
//                     <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                     </svg>
//                   )}
//                 </button>
//               </div>
//             </div>

//             {message && (
//               <div className={`auth-message ${message.includes("berhasil") ? "success" : "error"}`}>
//                 {message}
//               </div>
//             )}

//             <button
//               type="submit"
//               className="auth-button"
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <>
//                   <span className="spinner"></span>
//                   Memproses...
//                 </>
//               ) : (
//                 "Masuk"
//               )}
//             </button>
//           </form>

//           <div className="auth-footer">
//             <p>
//               Belum punya akun?{" "}
//               <Link to="/register" className="auth-link">
//                 Daftar sekarang
//               </Link>
//             </p>
//             <Link to="/" className="back-home">
//               ← Kembali ke Beranda
//             </Link>
//           </div>
//         </div>

//         <div className="auth-decoration">
//           <div className="decoration-circle circle-1"></div>
//           <div className="decoration-circle circle-2"></div>
//           <div className="decoration-circle circle-3"></div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LoginPage;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/authpage.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access");
      if (!token) {
        setIsCheckingAuth(false);
        return;
      }

      try {
        // Verifikasi token ke backend
        const response = await axios.post(
          "https://backendecombot-production.up.railway.app/api/token/verify/",
          { token }
        );

        // Kalau token valid → langsung masuk ke dashboard
        if (response.status === 200) {
          navigate("/ecomic", { replace: true });
        }
      } catch (err) {
        // Token invalid → coba refresh
        const refresh = localStorage.getItem("refresh");
        if (refresh) {
          try {
            const refreshResponse = await axios.post(
              "https://backendecombot-production.up.railway.app/api/token/refresh/",
              { refresh }
            );
            
            if (refreshResponse.data.access) {
              localStorage.setItem("access", refreshResponse.data.access);
              navigate("/ecomic", { replace: true });
              return;
            }
          } catch (refreshErr) {
            // Refresh juga gagal
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
          }
        } else {
          // Tidak ada refresh token
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
        }
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    
    try {
      const res = await axios.post(
        "https://backendecombot-production.up.railway.app/api/login/",
        { username, password }
      );
      
      // Simpan token
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      
      setMessage("Login berhasil! Mengalihkan...");
      
      // Redirect setelah delay singkat
      setTimeout(() => {
        navigate("/ecomic", { replace: true });
      }, 1000);
    } catch (err) {
      if (err.response?.status === 401) {
        setMessage("Username atau password salah!");
      } else if (err.response?.status === 400) {
        setMessage("Data login tidak valid!");
      } else if (!err.response) {
        setMessage("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
      } else {
        setMessage("Login gagal! Silakan coba lagi.");
      }
      setIsLoading(false);
    }
  };

  // Show loading saat cek auth
  if (isCheckingAuth) {
    return (
      <div className="auth-container">
        <div className="auth-wrapper">
          <div className="auth-card" style={{ textAlign: "center", padding: "3rem" }}>
            <div className="spinner-large"></div>
            <p style={{ marginTop: "1rem", color: "var(--text-dark)" }}>
              Memeriksa status login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <img src="/item/logo.svg" alt="ECOMBOT Logo" />
            </div>
            <h2 className="auth-title">Selamat Datang</h2>
            <p className="auth-subtitle">Masuk ke akun ECOMBOT Anda</p>
          </div>

          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-wrapper">
                <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  id="username"
                  type="text"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {message && (
              <div className={`auth-message ${message.includes("berhasil") ? "success" : "error"}`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              className="auth-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Memproses...
                </>
              ) : (
                "Masuk"
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Belum punya akun?{" "}
              <Link to="/register" className="auth-link">
                Daftar sekarang
              </Link>
            </p>
            <Link to="/" className="back-home">
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>

        <div className="auth-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
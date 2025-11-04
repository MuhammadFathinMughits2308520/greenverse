import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const accessToken = localStorage.getItem("access");
    const refreshToken = localStorage.getItem("refresh");

    try {
      if (refreshToken) {
        await axios.post(
          `${API_BASE}/logout/`,
          { refresh: refreshToken },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      }
    } catch (err) {
      console.warn("Logout di server gagal atau token sudah kedaluwarsa:", err);
    } finally {
      // 🔹 Hapus semua localStorage
      localStorage.clear();

      // 🔹 Hapus semua sessionStorage (kalau ada)
      sessionStorage.clear();

      // 🔹 Hapus semua cookies
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });

      // 🔹 Kirim event global agar komponen lain tahu user logout
      window.dispatchEvent(new Event("logout"));

      // 🔹 Arahkan ke halaman login
      navigate("/login", { replace: true });

      // 🔹 Opsional: cegah user menekan tombol "Back"
      setTimeout(() => {
        window.history.pushState(null, null, window.location.href);
        window.onpopstate = () => window.history.go(1);
      }, 0);
    }
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Keluar
    </button>
  );
}

export default LogoutButton;

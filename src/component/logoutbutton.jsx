import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const accessToken = localStorage.getItem("access");
    const refreshToken = localStorage.getItem("refresh");

    if (!refreshToken) {
      console.error("Tidak ada token refresh, mungkin belum login");
      return;
    }

    try {
      await axios.post(
        "https://backendecombot-production.up.railway.app/api/logout/",
        { refresh: refreshToken },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (err) {
      console.warn("Gagal logout di server (kemungkinan token sudah kedaluwarsa).");
    } finally {
      // Hapus semua data auth dari localStorage
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      // Kirim event global agar ProtectedRoute tahu user logout
      window.dispatchEvent(new Event("logout"));

      // Navigasi ke halaman login tanpa bisa kembali
      navigate("/login", { replace: true });

      // Opsional: mencegah user tekan tombol back untuk kembali
      setTimeout(() => {
        window.history.pushState(null, null, window.location.href);
        window.onpopstate = () => window.history.go(1);
      }, 0);
    }
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  );
}

export default LogoutButton;

import React from "react";
import axios from "axios";

function LogoutButton() {
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

      // Hapus token dari localStorage
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      alert("Berhasil logout!");
      window.location.href = "/login";
    } catch (err) {
      console.error("Gagal logout:", err);
      alert("Gagal logout, silakan coba lagi.");
    }
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  );
}

export default LogoutButton;

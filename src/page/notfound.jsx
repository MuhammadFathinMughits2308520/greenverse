import React from "react";
import { Link } from "react-router-dom";
import "../styles/notfound.css";

function NotFound() {
  return (
    <div className="notfound">
      <h1>404</h1>
      <h2>Halaman Tidak Ditemukan</h2>
      <p>Sepertinya kamu tersesat. Coba kembali ke halaman utama.</p>
      <Link to="/" className="back-home">Kembali ke Beranda</Link>
    </div>
  );
}

export default NotFound;

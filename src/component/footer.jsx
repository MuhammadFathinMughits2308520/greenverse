import React from "react";
import "../styles/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logos">
            <img className="amli" src="/item/amli.svg" alt="AMLI" />
            <img className="upi" src="/item/logoupi.svg" alt="UPI" />
            <img className="ecombot" src="/item/logo.svg" alt="ECOMBOT" />
          </div>
          <h2>ECOMBOT</h2>
          <p>Membantu proses belajar lebih mudah dan interaktif.</p>
        </div>

        <div className="footer-address">
          <h3>Alamat</h3>
          <p>Jl Dr. Setiabudi, Bandung<br/>Jawa Barat, Indonesia</p>
          <a href="https://www.upi.edu/" target="_blank" rel="noreferrer">www.upi.edu</a>
        </div>

        <div className="footer-social">
          <h3>Ikuti Kami</h3>
          <a href="https://www.instagram.com/pkmamli.greenverse/" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="mailto:greenverse14@gmail.com">
            Email
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 GreenVerse ECOMBOT. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;

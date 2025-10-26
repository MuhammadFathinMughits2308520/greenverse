import React from "react";
import "../styles/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <img src="/item/logo.svg" />
          <h2>ECOMBOT</h2>
          <p>Membantu proses belajar lebih mudah dan interaktif.</p>
        </div>

        <div className="footer-social">
          <h3>Ikuti Kami</h3>
          <a href="https://www.instagram.com/pkmamli.greenverse/" target="_blank" rel="noreferrer">Instagram</a><br/>
          <a href="mailto:greenverse14@gmail.com">Email</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 GreenVerse ECOMBOT. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;

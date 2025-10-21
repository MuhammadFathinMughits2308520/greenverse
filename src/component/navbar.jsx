import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useDarkMode } from '../context/DarkModeContext';
import '../styles/navbar.css';

function Navbar({ scrollToSection }) {
  const navigate = useNavigate();
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDark, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShow(false);
      } else {
        setShow(true);
      }

      setLastScrollY(currentScrollY);
    };

    const handleMouseMove = (e) => {
      if (e.clientY <= 70) {
        setShow(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [lastScrollY]);

  const handleNavClick = (section) => {
    scrollToSection(section);
    setMenuOpen(false);
  };

  return (
    <div className={`navbar ${show ? "visible" : "hidden"}`}>
      <div className='logo-nama'>
        <img src="/item/logo.svg" alt="Logo" loading='lazy' className='logo'/>
        <p className='nama'>GreenVerse Ecombot</p>
      </div>

      <button 
        className={`hamburger ${menuOpen ? 'active' : ''}`} 
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`link ${menuOpen ? 'active' : ''}`}>
        <a onClick={() => handleNavClick('beranda')} className='link-beranda'>
          Beranda
        </a>
        <a onClick={() => handleNavClick('team')} className='link-konten1'>
          Our Team
        </a>
        <a onClick={() => handleNavClick('konten1')} className='link-konten2'>
          Media
        </a>
        <a onClick={() => handleNavClick('konten2')} className='link-team'>
          Riset
        </a>
        <button className="tombol-produk" onClick={() => navigate('/ecomic')}>
          Get Started
        </button>
        <button 
          className="dark-mode-toggle" 
          onClick={toggleDarkMode}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Overlay untuk menutup menu saat klik di luar */}
      {menuOpen && (
        <div 
          className="menu-overlay" 
          onClick={() => setMenuOpen(false)}
        />
      )}
    </div>
  );
}

export default Navbar;
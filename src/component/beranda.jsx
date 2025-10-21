import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../styles/beranda.css';


function Beranda() {
  const navigate  = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Array gambar background (ganti dengan URL gambar Anda)
  const slides = [
    {
      bg: '/item/gambar-beranda1.JPG',
      title: 'PKM - RSH',
      subtitle: 'E-Comic Berbasis Robot Virtual Bermuatan Kearifan Lokal Mapag Hujan dengan Pendekatan STREAM sebagai Sarana Literasi Lingkungan untuk Mendukung Program Prioritas'
    },
    {
      bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      title: 'Inovasi Teknologi',
      subtitle: 'Solusi Masa Depan'
    },
    {
      bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      title: 'Ramah Lingkungan',
      subtitle: 'Menuju Masa Depan Hijau'
    },
    {
      bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      title: 'Pengembangan Berkelanjutan',
      subtitle: 'Bersama Membangun'
    }
  ];

  // Auto slide setiap 5 detik
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [isAutoPlay, slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlay(false); // Pause auto-play saat manual click
    setTimeout(() => setIsAutoPlay(true), 10000); // Resume setelah 10 detik
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="carousel-container" id='beranda'>
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
            style={{
              backgroundImage: slide.bg.startsWith('linear-gradient')
                ? slide.bg
                : `url(${slide.bg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="overlay"></div>
            <div className="slide-content">
              <h1 className="slide-title">{slide.title}</h1>
              <p className="slide-subtitle">{slide.subtitle}</p>
              <button className="produk-btn" onClick={() => navigate('/ecomic')}>Get Started</button>
            </div>
          </div>
        ))}

        {/* Arrow Navigation */}
        <button className="carousel-arrow arrow-left" onClick={prevSlide}>
          ‹
        </button>
        <button className="carousel-arrow arrow-right" onClick={nextSlide}>
          ›
        </button>

        {/* Indicators */}
        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
  );
}

export default Beranda;
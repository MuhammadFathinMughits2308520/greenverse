import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../styles/beranda.css';

function Beranda() {
  const navigate  = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  // Slides dengan opsi background khusus desktop & mobile
  const slides = [
    {
      // Slide 1: tampilkan 3 baris (small title, big product, deskripsi)
      titleSmall: 'PKM AMLI-RSH 2025',
      produk: 'ECOMBOT',
      subtitle: `<i>E-Comic</i> Berbasis Robot Virtual Bermuatan Kearifan Lokal Mapag Hujan dengan Pendekatan STREAM untuk Mendukung Program Prioritas`,
      // background khusus: gunakan gambar untuk desktop, gambar lebih kecil atau berbeda untuk mobile
      desktopBg: '/item/laptop/gambar-beranda1.png',
      mobileBg: '/item/mobile/gambar-beranda1.png' // sediakan image mobile atau fallback ke desktop jika tidak ada
    },
    {
      title: 'Inovasi Media Pembelajaran Digital',
      desktopBg: '/item/laptop/gambar-beranda2.png',
      mobileBg: '/item/mobile/gambar-beranda2.png'
    },
    {
      title: 'Sarana Penguatan Literasi Lingkungan',
      desktopBg: '/item/laptop/gambar-beranda3.png',
      mobileBg: '/item/mobile/gambar-beranda3.png'
    },
    {
      title: 'Bermuatan Kearifan Lokal',
      desktopBg: '/item/laptop/gambar-beranda4.png',
      mobileBg: '/item/mobile/gambar-beranda4.png'
    }
  ];

  // Update isMobile saat resize
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Auto slide setiap 10 detik (sebelumnya 5 detik; di kode awal interval 10000ms)
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [isAutoPlay, slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlay(false); // pause auto-play saat manual click
    setTimeout(() => setIsAutoPlay(true), 10000); // resume setelah 10 detik
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // helper: pilih background berdasarkan device & format string
  const getBackgroundStyle = (slide) => {
    const bgSource = isMobile ? (slide.mobileBg ?? slide.desktopBg ?? slide.bg) : (slide.desktopBg ?? slide.bg ?? slide.mobileBg);
    if (!bgSource) return {};
    const bgValue = String(bgSource).trim();
    const isGradient = bgValue.startsWith('linear-gradient') || bgValue.startsWith('radial-gradient');
    return {
      backgroundImage: isGradient ? bgValue : `url(${bgValue})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    };
  };

  return (
    <div className="carousel-container" id="beranda">
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={index}
            className={`carousel-slide ${isActive ? 'active' : ''}`}
            style={getBackgroundStyle(slide)}
          >
            <div className="overlay" />
            <div className="slide-content">
              {/* Jika slide memiliki struktur produk (slide pertama), render format khusus */}
              {slide.produk ? (
                <>
                  <div className="slide-meta">
                    {/* judul kecil */}
                    <div className="slide-title-small">{slide.titleSmall}</div>
                    {/* produk besar */}
                    <div className="slide-produk">{slide.produk}</div>
                  </div>

                  {/* deskripsi panjang */}
                  <p className="slide-subtitle slide-subtitle-long" dangerouslySetInnerHTML={{ __html: slide.subtitle }}></p>
                </>
              ) : (
                <>
                  {/* slide biasa */}
                  <h2 className="slide-title">{slide.title}</h2>
                  <p className="slide-subtitle" dangerouslySetInnerHTML={{ __html: slide.subtitle }}></p>
                </>
              )}

              <button
                className="produk-btn"
                onClick={() => navigate('/ecomic')}
                aria-label="Get Started ECOMBOT"
              >
                Akses Media
              </button>
            </div>
          </div>
        );
      })}

      {/* Arrow Navigation */}
      <button className="carousel-arrow arrow-left" onClick={prevSlide} aria-label="previous slide">
        ‹
      </button>
      <button className="carousel-arrow arrow-right" onClick={nextSlide} aria-label="next slide">
        ›
      </button>

      {/* Indicators */}
      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') goToSlide(index); }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Beranda;

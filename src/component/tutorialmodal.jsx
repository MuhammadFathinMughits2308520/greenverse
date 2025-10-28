// TutorialModal.jsx
import React, { useState, useRef, useEffect } from 'react';
import '../styles/tutorialmodal.css';

const TutorialModal = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Data slide petunjuk - sesuaikan URL gambar dengan path Anda
  const tutorialSlides = {
    desktop: [
      {
        id: 1,
        image: '/tutorial/desktop-1.png',
        title: 'Selamat Datang di Comic Reader',
        description: 'Pelajari cara menggunakan comic reader dengan mudah'
      },
      {
        id: 2,
        image: '/tutorial/desktop-2.png',
        title: 'Navigasi Halaman',
        description: 'Gunakan tombol panah atau keyboard untuk berpindah halaman'
      },
      {
        id: 3,
        image: '/tutorial/desktop-3.png',
        title: 'Fitur Chatbot',
        description: 'Klik ikon chatbot untuk eksplorasi dan membuka halaman berikutnya'
      },
      {
        id: 4,
        image: '/tutorial/desktop-4.png',
        title: 'Mode Gelap',
        description: 'Toggle mode gelap/terang untuk kenyamanan membaca'
      }
    ],
    mobile: [
      {
        id: 1,
        image: '/tutorial/mobile-1.png',
        title: 'Selamat Datang',
        description: 'Panduan menggunakan comic reader di perangkat mobile'
      },
      {
        id: 2,
        image: '/tutorial/mobile-2.png',
        title: 'Swipe untuk Navigasi',
        description: 'Geser ke kiri/kanan untuk berpindah halaman'
      },
      {
        id: 3,
        image: '/tutorial/mobile-3.png',
        title: 'Tap untuk Menu',
        description: 'Ketuk gambar untuk menampilkan/menyembunyikan menu'
      },
      {
        id: 4,
        image: '/tutorial/mobile-4.png',
        title: 'Chatbot & Fitur',
        description: 'Akses chatbot dan fitur lainnya dengan mudah'
      }
    ]
  };

  const slides = isMobile ? tutorialSlides.mobile : tutorialSlides.desktop;
  const totalSlides = slides.length;

  // Detect screen size changes
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 600;
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile);
        setCurrentSlide(0);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  // Reset slide when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentSlide(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Navigation functions
  const goToNextSlide = () => {
    const nextSlide = currentSlide + 1;
    if (nextSlide < totalSlides) {
      setCurrentSlide(nextSlide);
    }
  };

  const goToPrevSlide = () => {
    const prevSlide = currentSlide - 1;
    if (prevSlide >= 0) {
      setCurrentSlide(prevSlide);
    }
  };

  const goToSlide = (index) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlide(index);
    }
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    // Stop propagation to prevent triggering parent touch events
    e.stopPropagation();
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    // Stop propagation to prevent triggering parent touch events
    e.stopPropagation();
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    // Stop propagation to prevent triggering parent touch events
    e.stopPropagation();
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        // Swipe left - next slide
        goToNextSlide();
      } else {
        // Swipe right - previous slide
        goToPrevSlide();
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goToNextSlide();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevSlide();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSlide, totalSlides, onClose]);

  if (!isOpen) return null;

  return (
    <div className="tutorial-overlay" onClick={onClose}>
      <div 
        className="tutorial-modal" 
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'none' }}
      >
        {/* Close Button */}
        <button className="tutorial-close" onClick={onClose} aria-label="Close tutorial">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Slide Container */}
        <div className="tutorial-content">
          <div className="tutorial-slide">
            <div className="tutorial-image-wrapper">
              <img 
                src={slides[currentSlide].image} 
                alt={slides[currentSlide].title}
                className="tutorial-image"
              />
            </div>
            
            <div className="tutorial-text">
              <h2 className="tutorial-title">{slides[currentSlide].title}</h2>
              <p className="tutorial-description">{slides[currentSlide].description}</p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons - Desktop & Tablet */}
        {!isMobile && (
          <>
            {currentSlide > 0 && (
              <button 
                className="tutorial-nav-btn tutorial-prev" 
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevSlide();
                }}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                aria-label="Previous slide"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
            )}
            
            {currentSlide < totalSlides - 1 && (
              <button 
                className="tutorial-nav-btn tutorial-next" 
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextSlide();
                }}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                aria-label="Next slide"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            )}
          </>
        )}

        {/* Progress Indicators */}
        <div className="tutorial-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`tutorial-indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="tutorial-actions">
          <span className="tutorial-counter">
            {currentSlide + 1} / {totalSlides}
          </span>
          
          {currentSlide === totalSlides - 1 ? (
            <button className="tutorial-btn tutorial-done" onClick={onClose}>
              Selesai
            </button>
          ) : (
            <button className="tutorial-btn tutorial-skip" onClick={onClose}>
              Lewati
            </button>
          )}
        </div>

        {/* Swipe Hint for Mobile */}
        {isMobile && (
          <div className="tutorial-swipe-hint">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="5 12 9 12"></polyline>
              <polyline points="15 12 19 12"></polyline>
              <polyline points="9 16 5 12 9 8"></polyline>
              <polyline points="15 16 19 12 15 8"></polyline>
            </svg>
            <span>Geser untuk navigasi</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorialModal;
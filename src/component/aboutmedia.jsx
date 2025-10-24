import React, { useEffect, useState, useRef } from 'react';
import '../styles/aboutmedia.css';

function AboutMedia() {
    const [isVisible, setIsVisible] = useState(false);
        const aboutteamRef = useRef(null);
    
        useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
            // Trigger animasi ketika elemen masuk atau keluar viewport
                if (entry.isIntersecting) {
                    setIsVisible(true);
                } else {
                    setIsVisible(false); // Reset animasi ketika keluar viewport
                }
            },
            {
                threshold: 0.2, // Trigger ketika 20% elemen terlihat
                rootMargin: '0px'
            }
        );
    
            if (aboutteamRef.current) {
                observer.observe(aboutteamRef.current);
            }
    
            return () => {
            if (aboutteamRef.current) {
                observer.unobserve(aboutteamRef.current);
            }
            };
        }, []);

    return (
        <div className='AboutMedia' ref={aboutteamRef}>
            <h2 className={`AboutMedia-judul ${isVisible ? 'visible' : ''}`}>
                Apa itu ECOMBOT?
            </h2>
            <p className={`AboutMedia-about ${isVisible ? 'visible' : ''}`}>
                ECOMBOT adalah media pembelajaran interaktif dan inovatif.  Media ini menggabungkan <i>E-Comic</i> dengan Robot Virtual dalam bentuk ChatBot yang memuat kearifan lokal Mapag Hujan sebagai media sebagai sarana penguatan literasi lingkungan. Melalui pendekatan STREAM (<i>Science, Technology, Robotics, Engineering, Arts, and Mathematics</i>), ECOMBOT membantu pengguna mengeksplorasi keterkaitan berbagai disiplin ilmu dalam upaya menjaga kelestarian lingkungan.
            </p>
        </div>
    );
}

export default AboutMedia;
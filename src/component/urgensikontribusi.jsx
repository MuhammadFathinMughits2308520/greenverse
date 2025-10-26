import React, { useEffect, useState, useRef } from 'react';
import '../styles/urgensikontribusi.css';

function UrgensiKontribusi() {
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
        <div className='UrgensiKontribusi' ref={aboutteamRef}>
            <h2 className={`UrgensiKontribusi-judul ${isVisible ? 'visible' : ''}`}>
                Urgensi & Kontribusi
            </h2>
            <p
            className={`UrgensiKontribusi-about ${isVisible ? 'visible' : ''}`}>
                Riset ini berfokus pada penguatan sarana literasi lingkungan melalui pengembangan media pembelajaran digital di bidang pendidikan, sains, teknologi dan seni budaya dalam pembelajaran abad 21 di era Revolusi 4.0 dan <i>Society</i> 5.0. ECOMBOT menjadi bentuk inovasi pendidik dalam mengoptimalkan penguatan literasi lingkungan melalui pengembangan media pembelajaran yang mengintegrasikan <i>e-comic</i>, robot virtual, kearifan lokal Mapag Hujan, dan pendekatan STREAM (<i>Science, Technology, Robotics, Engineering, Arts, and Mathematics</i>), sehingga menciptakan pengalaman belajar yang menarik, interaktif, humanis, dan kontekstual.
            </p>
        </div>
    );
}

export default UrgensiKontribusi;
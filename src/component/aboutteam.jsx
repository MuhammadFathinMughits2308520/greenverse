import React, { useEffect, useState, useRef } from 'react';
import '../styles/aboutteam.css';

function AboutTeam() {
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
        <div className='AboutTeam' ref={aboutteamRef}>
            <h2 className={`AboutTeam-judul ${isVisible ? 'visible' : ''}`}>
                GreenVerse Team
            </h2>
            <p className={`AboutTeam-about ${isVisible ? 'visible' : ''}`}>
                GreenVerse adalah tim kolaboratif yang beranggotakan 5 orang dari program studi pendidikan kimia dan ilmu komputer yang tergabung dalam PKM-AMLI skema Riset Sosial Humaniora (RSH). Tim ini berfokus pada penguatan literasi lingkungan melalui pengembangan media pembelajaran inovatif berbasis digital dan kearifan lokal yang relevan sebagai sarana literasi lingkungan dalam pembelajaran abad ke-21.
            </p>
        </div>
    );
}

export default AboutTeam;
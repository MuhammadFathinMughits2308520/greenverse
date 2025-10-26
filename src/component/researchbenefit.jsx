import React, { useEffect, useState, useRef } from 'react';
import '../styles/researchbenefit.css';

function ResearchBenefit() {
    const [isVisible, setIsVisible] = useState(false);
    const aboutteamRef = useRef(null);
    
    const cards = [
        {
            judul: 'Media Pembelajaran Inovatif',
            isi: 'Menyediakan media pembelajaran digital yang interaktif dan menarik yaitu ECOMBOT (<i>E-Comic</i> berbasis Robot Virtual).'
        },
        {
            judul: 'Sarana Literasi Lingkungan dan Nilai Budaya',
            isi: 'Mendorong internalisasi nilai-nilai literasi lingkungan dan budaya setiap individu baik secara akademik maupun praktis.'
        },
        {
            judul: 'Relevansi Program Prioritas Nasional',
            isi: 'Upaya untuk mendukung Program Prioritas Pemerintah, khususnya Nomor 8 tentang penguatan pendidikan, sains, teknologi, dan digitalisasi, serta Nomor 17 khususnya tentang pelestarian seni dan budaya.'
        },
    ]
    
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
        <div className='ResearchBenefit' ref={aboutteamRef}>
            <h2 className={`ResearchBenefit-judul ${isVisible ? 'visible' : ''}`}>
                Manfaat Riset
            </h2>
            <div className='ResearchBenefit-konten'>
                {cards.map((card, index) => (
                <div
                    key={index}
                    className={`ResearchBenefit-konten-card ${isVisible ? 'visible' : ''}`}
                >
                    <h3 className="card-judul">{card.judul}</h3>
                    <p className="card-isi" dangerouslySetInnerHTML={{ __html: card.isi }}></p>
                </div>
                ))}
            </div>
        </div>
    );
}

export default ResearchBenefit;
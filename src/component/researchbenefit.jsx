import React, { useEffect, useState, useRef } from 'react';
import '../styles/researchbenefit.css';

function ResearchBenefit() {
    const [isVisible, setIsVisible] = useState(false);
    const aboutteamRef = useRef(null);
    
    const cards = [
        {
            judul: 'Media Pembelajaran Inovatif',
            isi: 'Menyediakan media pembelajaran digital yang interaktif dan menarik, memadukan komik digital dengan robot virtual bermuatan kearifan lokal Mapag Hujan dengan pendekatan STREAM (<i>Science, Technology, Robotics, Engineering, Arts, and Mathematics</i>) sebagai sarana literasi lingkungan'
        },
        {
            judul: 'Integrasi Nilai Budaya dan Lingkungan',
            isi: 'Mendorong internalisasi nilai-nilai individu dan budaya melalui literasi lingkungan berbasis kearifan lokal, baik secara akademik maupun praktis.'
        },
        {
            judul: 'Dukungan terhadap Program Prioritas Nasional',
            isi: 'Berperan dalam mendukung Program Prioritas Pemerintah: <br>No. 8  :<br>Penguatan pendidikan, sains, teknologi, dan digitalisasi.<br>No. 17:<br>Pelestarian seni dan budaya.'
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
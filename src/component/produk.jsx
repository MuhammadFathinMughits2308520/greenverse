import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import '../styles/produk.css';

function Produk() {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const aboutteamRef = useRef(null);
    
    const cards = [
        {
        judul: 'Laporan Akhir',
        isi: 'Berisi hasil lengkap proses dan temuan penelitian.',
        action: () => window.open('https://example.com/laporan', '_blank'), // 🌐 eksternal
        link_subtitle: 'Lihat'
        },
        {
        judul: 'Akun Instagram Resmi',
        isi: 'Ikuti kami di Instagram: @pkmamli.greenverse untuk update kegiatan, karya siswa, dan kampanye literasi lingkungan!',
        action: () => window.open('https://www.instagram.com/pkmamli.greenverse', '_blank'), // 🌐 eksternal
        link_subtitle: 'Kunjungi'
        },
        {
        judul: 'Artikel Ilmiah',
        isi: 'Berjudul “E-Comic Berbasis Robot Virtual Bermuatan Kearifan Lokal Mapag Hujan dengan Pendekatan STREAM sebagai Sarana Literasi Lingkungan dalam Mendukung Program Prioritas.”',
        action: () => window.open('https://example.com/artikel', '_blank'), // 🌐 eksternal
        link_subtitle: 'Lihat'
        },
        {
        judul: 'Produk E-Comic (ECOMBOT)',
        isi: 'Sebuah komik digital interaktif yang menggabungkan teknologi robot virtual, pendekatan STREAM, dan kearifan lokal Mapag Hujan sebagai sarana literasi lingkungan yang edukatif dan interaktif.',
        action: () => navigate('/ecomic'), // 🔁 internal
        link_subtitle: 'Get Started'
        },
    ];
    
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
        <div className='produk' ref={aboutteamRef}>
            <h2 className={`produk-judul ${isVisible ? 'visible' : ''}`}>
                Hasil Riset
            </h2>
            <div className='produk-konten'>
                {cards.map((card, index) => (
                <div
                    key={index}
                    className={`produk-konten-card ${isVisible ? 'visible' : ''}`}
                >
                    <h3 className="card-judul">{card.judul}</h3>
                    <p className="card-isi" dangerouslySetInnerHTML={{ __html: card.isi }}></p>
                    <button className='card-button' onClick={card.action}>{card.link_subtitle}</button>
                </div>
                ))}
            </div>
        </div>
    );
}

export default Produk;
import React, { useEffect, useState, useRef } from 'react';
import '../styles/muatanlokal.css';

const MuatanLokaInfo = () => {
  const [isVisible, setIsVisible] = useState(false);
  const muatanLokalRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px'
      }
    );

    if (muatanLokalRef.current) {
      observer.observe(muatanLokalRef.current);
    }

    return () => {
      if (muatanLokalRef.current) {
        observer.unobserve(muatanLokalRef.current);
      }
    };
  }, []);

  const cards = [
    {
      id: 1,
      title: 'Mitigasi Banjir dan Pengelolaan Sampah',
      description: 'Upaya pelestarian lingkungan dalam gerakan "Maraton Bebersih Walungan dan Susukan"'
    },
    {
      id: 2,
      title: 'Gotong Royong',
      description: 'Kerja sama melibatkan masyarakat, komunitas, dan pemerintah setempat'
    },
    {
      id: 3,
      title: 'Seni dan Budaya Lokal',
      description: 'Pertunjukkan seni dan budaya yang memadukan ekspresi dan rasa syukur terhadap alam.'
    }
  ];

  return (
    <section 
      className="muatan-lokal-section" 
      id="muatan-lokal-penjelasan" 
      ref={muatanLokalRef}
    >
      <div className="muatan-lokal-container">
        {/* Header */}
        <div className="muatan-lokal-header">
          <h2 className={`muatan-lokal-title ${isVisible ? 'visible' : ''}`}>
            Muatan Lokal
          </h2>
          <p className={`muatan-lokal-description ${isVisible ? 'visible' : ''}`}>
            Konten media ini disajikan dengan konteks muatan kearifan lokal yang relevan, 
            yaitu tradisi <strong>Mapag Hujan</strong> untuk mendorong nilai-nilai internalisasi 
            murid mengenai literasi lingkungan dan budaya secara akademik maupun praktis. 
            Mapag Hujan sebagai tradisi masyarakat Jawa Barat, khususnya Subang dan Bandung 
            untuk menyambut datangnya musim hujan.
          </p>
        </div>

        {/* Cards */}
        <div className={`muatan-lokal-cards ${isVisible ? 'visible' : ''}`}>
          {cards.map((card) => (
            <div key={card.id} className="muatan-card">
              <h3 className="muatan-card-title">{card.title}</h3>
              <p className="muatan-card-text">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MuatanLokaInfo;
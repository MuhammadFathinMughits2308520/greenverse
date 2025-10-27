import React from 'react';
import '../styles/muatanlokal.css';

const MuatanLokalDokum = () => {
  const galleryImages = [
    {
      id: 1,
      src: 'https://res.cloudinary.com/dr6dp1ulc/image/upload/v1761576546/image_7_tqnhjr.png',
      alt: 'Mitigasi Banjir dan Pengelolaan Sampah',
      caption: 'Upaya pelestarian lingkungan dalam gerakan “Maraton Bebersih Walungan dan Susukan”'
    },
    {
      id: 2,
      src: 'https://res.cloudinary.com/dr6dp1ulc/image/upload/v1761576544/Rectangle_17_kjjnzt.png',
      alt: 'Mitigasi Banjir dan Pengelolaan Sampah',
      caption: 'Upaya pelestarian lingkungan dalam gerakan “Maraton Bebersih Walungan dan Susukan”'
    },
    {
      id: 3,
      src: 'https://res.cloudinary.com/dr6dp1ulc/image/upload/v1761576540/image_23_z0t6k6.png',
      alt: 'Gotong Royong',
      caption: 'Kerja sama melibatkan masyarakat, komunitas, dan pemerintah setempat'
    },
    {
      id: 4,
      src: 'https://res.cloudinary.com/dr6dp1ulc/image/upload/v1761576544/image_19_fo70vg.png',
      alt: 'Seni dan Budaya Lokal',
      caption: 'Pertunjukkan seni dan budaya yang memadukan ekspresi dan rasa syukur terhadap alam.'
    },
    {
      id: 5,
      src: 'https://res.cloudinary.com/dr6dp1ulc/image/upload/v1761576541/image_20_iliw8u.png',
      alt: 'Seni dan Budaya Lokal',
      caption: 'Pertunjukkan seni dan budaya yang memadukan ekspresi dan rasa syukur terhadap alam.'
    },
    {
      id: 6,
      src: 'https://res.cloudinary.com/dr6dp1ulc/image/upload/v1761576546/image_21_uxjb0s.png',
      alt: 'Seni dan Budaya Lokal',
      caption: 'Pertunjukkan seni dan budaya yang memadukan ekspresi dan rasa syukur terhadap alam.'
    }
  ];

  return (
    <section className="muatan-lokal-gallery" id="muatan-lokal-dokumentasi">
      <div className="muatan-lokal-container">
        <h3 className="gallery-title">Dokumentasi Kegiatan</h3>
        <p className="gallery-subtitle">
          Dokumentasi kegiatan dan tradisi Mapag Hujan di Jawa Barat
        </p>
        <div className="gallery-grid">
          {galleryImages.map((image) => (
            <div key={image.id} className="gallery-item">
              <div className="image-wrapper">
                <img src={image.src} alt={image.alt} loading="lazy" />
                <div className="image-overlay">
                  <p>{image.caption}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MuatanLokalDokum;

import React from 'react';
import '../styles/muatanlokal.css';

const MuatanLokaInfo = () => {
  return (
    <section className="muatan-lokal-section" id="muatan-lokal-penjelasan">
      <div className="muatan-lokal-container">
        <div className="muatan-lokal-header">
          <h2 className="muatan-lokal-title">Muatan Lokal</h2>
          <p className="muatan-lokal-description">
            Konten media ini disajikan dengan konteks muatan kearifan lokal yang relevan, yaitu tradisi Mapag Hujan untuk mendorong nilai-nilai internalisasi murid mengenai literasi lingkungan dan budaya secara akademik maupun praktis.
Mapag Hujan sebagai tradisi masyarakat Jawa Barat, khususnya Subang dan Bandung untuk menyambut datangnya musim hujan
          </p>
        </div>

        <div className="muatan-lokal-cards">
          <div className="muatan-card">
            <h3 className="muatan-card-title">Tradisi Mapag Hujan</h3>
            <p className="muatan-card-text">
              Mapag Hujan sebagai tradisi masyarakat Jawa Barat, khususnya Subang dan Bandung 
              untuk menyambut datangnya musim hujan. Tradisi ini memiliki nilai-nilai literasi 
              lingkungan dan budaya.
            </p>
          </div>

          <div className="muatan-card">
            <h3 className="muatan-card-title">Fokus di Bandung</h3>
            <p className="muatan-card-text">
              Di Bandung, Mapag Hujan lebih difokuskan pada mitigasi banjir melalui peningkatan 
              resapan air, pengelolaan sampah, dan pelestarian lingkungan yang melibatkan masyarakat, 
              pemerintah setempat, dan komunitas.
            </p>
          </div>

          <div className="muatan-card">
            <h3 className="muatan-card-title">Maraton Bebersih</h3>
            <p className="muatan-card-text">
              Gerakan "Maraton Bebersih Walungan dan Susukan" menjadi wujud nyata dari nilai-nilai 
              literasi lingkungan yang menekankan kesadaran, pemahaman, dan tindakan nyata dalam 
              menjaga kelestarian alam.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MuatanLokaInfo;

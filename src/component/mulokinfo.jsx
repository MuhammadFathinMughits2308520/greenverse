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
            <h3 className="muatan-card-title">Mitigasi banjir dan Pengelolaan sampah</h3>
            <p className="muatan-card-text">
              Upaya pelestarian lingkungan dalam gerakan “Maraton Bebersih Walungan dan Susukan”
            </p>
          </div>

          <div className="muatan-card">
            <h3 className="muatan-card-title">Gotong Royong</h3>
            <p className="muatan-card-text">
              Kerja sama melibatkan masyarakat, komunitas, dan pemerintah setempat
            </p>
          </div>

          <div className="muatan-card">
            <h3 className="muatan-card-title">Seni dan Budaya Lokal</h3>
            <p className="muatan-card-text">
              Pertunjukkan seni dan budaya yang memadukan ekspresi dan rasa syukur terhadap alam.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MuatanLokaInfo;

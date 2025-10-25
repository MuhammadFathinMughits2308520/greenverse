import React, { useState, useEffect } from 'react';
import "../styles/viewfeedback.css";
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://backendecombot-production.up.railway.app/api';


// Komponen untuk card feedback individual
const FeedbackCard = ({ feedback }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="feedback-card">
      <div className="feedback-header">
        <div className="user-info">
          <span className="icon">👤</span>
          <h3>{feedback.nama || 'Anonim'}</h3>
        </div>
      </div>

      {feedback.email && (
        <div className="feedback-email">
          <span className="icon">✉️</span>
          <span>{feedback.email}</span>
        </div>
      )}

      <div className="feedback-message">
        <p>{feedback.pesan}</p>
      </div>

      <div className="feedback-date">
        <span className="icon">📅</span>
        <span>{formatDate(feedback.tanggal)}</span>
      </div>
    </div>
  );
};

// Komponen untuk loading state
const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
    </div>
  );
};

// Komponen untuk error state
const ErrorMessage = ({ message }) => {
  return (
    <div className="error-message">
      <span className="error-icon">⚠️</span>
      <div>
        <h3>Terjadi Kesalahan</h3>
        <p>{message}</p>
      </div>
    </div>
  );
};

// Komponen untuk empty state
const EmptyState = () => {
  return (
    <div className="empty-state">
      <span className="empty-icon">💬</span>
      <h3>Belum Ada Feedback</h3>
      <p>Feedback akan muncul di sini setelah ada yang mengirim.</p>
    </div>
  );
};

// Komponen untuk filter dan sorting
const FeedbackFilters = ({ sortBy, setSortBy }) => {
  return (
    <div className="feedback-filters">
      <div className="filter-group">
        <label>Urutkan:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Terbaru</option>
          <option value="oldest">Terlama</option>
        </select>
      </div>
    </div>
  );
};

// Komponen utama
const FeedbackDisplay = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/feedback/`);
      
      if (!response.ok) {
        throw new Error('Gagal mengambil data feedback');
      }

      const data = await response.json();
      setFeedbacks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSortedFeedbacks = () => {
    let sorted = [...feedbacks];

    sorted.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.tanggal) - new Date(a.tanggal);
      } else {
        return new Date(a.tanggal) - new Date(b.tanggal);
      }
    });

    return sorted;
  };

  const displayedFeedbacks = getSortedFeedbacks();

  return (
      <div className="feedback-container">
        <header className="feedback-header-main">
          <h1>Umpan Balik Pengguna</h1>
          <p>Lihat semua Umpan Balik yang telah dikirimkan</p>
        </header>

        <div className="feedback-stats">
          <div className="stat-card">
            <div className="stat-number">{feedbacks.length}</div>
            <div className="stat-label">Total Feedback</div>
          </div>
        </div>

        <FeedbackFilters
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {loading && <LoadingSpinner />}
        
        {error && <ErrorMessage message={error} />}
        
        {!loading && !error && displayedFeedbacks.length === 0 && <EmptyState />}
        
        {!loading && !error && displayedFeedbacks.length > 0 && (
          <div className="feedback-grid">
            {displayedFeedbacks.map((feedback) => (
              <FeedbackCard key={feedback.id} feedback={feedback} />
            ))}
          </div>
        )}
      </div>
  );
};

export default FeedbackDisplay;
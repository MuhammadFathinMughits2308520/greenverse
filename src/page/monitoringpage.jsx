import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import '../styles/teacherMonitoring.css';
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';


// ==================== KOMPONEN NAVIGASI ====================
const Navigation = ({ activeTab, setActiveTab, isDark, toggleDarkMode }) => {
  return (
    <nav className="teacher-navigation">
      <div className="teacher-nav-container">
        <div className="teacher-nav-header">
          <div className="teacher-nav-brand">
            <span className="teacher-nav-icon">📚</span>
            <h2>Portal Guru</h2>
          </div>
          <button 
            className="teacher-dark-mode-toggle" 
            onClick={toggleDarkMode}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
        <div className="teacher-nav-tabs">
          <button 
            className={`teacher-nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="teacher-tab-icon">📊</span>
            <span>Dashboard</span>
          </button>
          <button 
            className={`teacher-nav-tab ${activeTab === 'answers' ? 'active' : ''}`}
            onClick={() => setActiveTab('answers')}
          >
            <span className="teacher-tab-icon">📝</span>
            <span>Jawaban Siswa</span>
          </button>
          <button 
            className={`teacher-nav-tab ${activeTab === 'feedback' ? 'active' : ''}`}
            onClick={() => setActiveTab('feedback')}
          >
            <span className="teacher-tab-icon">💬</span>
            <span>Feedback</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

// ==================== KOMPONEN DASHBOARD ====================
const DashboardFilters = ({ filters, setFilters, onSearch }) => {
  return (
    <div className="teacher-filters-card">
      <h3 className="teacher-filters-title">Filter Data</h3>
      <div className="teacher-filters-grid">
        <div className="teacher-filter-item">
          <label>Username Siswa</label>
          <input 
            type="text" 
            placeholder="Cari username..."
            value={filters.username}
            onChange={(e) => setFilters({...filters, username: e.target.value})}
          />
        </div>
        <div className="teacher-filter-item">
          <label>Status Komik</label>
          <select 
            value={filters.status_komik}
            onChange={(e) => setFilters({...filters, status_komik: e.target.value})}
          >
            <option value="">Semua</option>
            <option value="Selesai">Selesai</option>
            <option value="Belum">Belum</option>
          </select>
        </div>
        <div className="teacher-filter-item">
          <label>Status Chat</label>
          <select 
            value={filters.chat_status}
            onChange={(e) => setFilters({...filters, chat_status: e.target.value})}
          >
            <option value="">Semua</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
          </select>
        </div>
      </div>
      <button className="teacher-btn-primary" onClick={onSearch}>
        <span>🔍</span> Cari Data
      </button>
    </div>
  );
};

const DashboardTable = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="teacher-loading-container">
        <div className="teacher-spinner"></div>
        <p>Memuat data...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="teacher-empty-state">
        <span className="teacher-empty-icon">📭</span>
        <h3>Tidak Ada Data</h3>
        <p>Belum ada data siswa yang tersedia</p>
      </div>
    );
  }

  return (
    <div className="teacher-table-container">
      <table className="teacher-data-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Siswa</th>
            <th>Komik</th>
            <th>Halaman Terakhir</th>
            <th>Status Komik</th>
            <th>Status Chat</th>
            <th>Kegiatan</th>
            <th>Jawaban Terkumpul</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td className="teacher-student-name">{row.siswa}</td>
              <td>{row.komik}</td>
              <td>{row.halaman_terakhir}</td>
              <td>
                <span className={`teacher-badge ${row.status_komik === 'Selesai' ? 'teacher-badge-success' : 'teacher-badge-warning'}`}>
                  {row.status_komik}
                </span>
              </td>
              <td>
                <span className={`teacher-badge ${row.chat_status === 'completed' ? 'teacher-badge-success' : row.chat_status === 'active' ? 'teacher-badge-info' : 'teacher-badge-secondary'}`}>
                  {row.chat_status}
                </span>
              </td>
              <td>{row.kegiatan}</td>
              <td className="teacher-answers-count">{row.jawaban_terkumpul}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    username: '',
    komik: '',
    status_komik: '',
    chat_status: ''
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.username) params.append('username', filters.username);
      if (filters.komik) params.append('komik', filters.komik);
      if (filters.status_komik) params.append('status_komik', filters.status_komik);
      if (filters.chat_status) params.append('chat_status', filters.chat_status);

      const response = await fetch(`${API_BASE}/teacher/dashboard/?${params}`);
      if (!response.ok) throw new Error('Gagal mengambil data dashboard');
      
      const result = await response.json();
      setData(result.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="teacher-page-container">
      <DashboardFilters filters={filters} setFilters={setFilters} onSearch={fetchDashboard} />
      <DashboardTable data={data} loading={loading} />
    </div>
  );
};

// ==================== KOMPONEN JAWABAN SISWA ====================
const AnswersFilters = ({ filters, setFilters, onSearch }) => {
  return (
    <div className="teacher-filters-card">
      <h3 className="teacher-filters-title">Filter Jawaban</h3>
      <div className="teacher-filters-grid">
        <div className="teacher-filter-item">
          <label>Pencarian</label>
          <input 
            type="text" 
            placeholder="Username, pertanyaan, atau jawaban..."
            value={filters.q}
            onChange={(e) => setFilters({...filters, q: e.target.value})}
          />
        </div>
        <div className="teacher-filter-item">
          <label>Kegiatan</label>
          <input 
            type="text" 
            placeholder="Nama kegiatan..."
            value={filters.activity}
            onChange={(e) => setFilters({...filters, activity: e.target.value})}
          />
        </div>
        <div className="teacher-filter-item">
          <label>Tipe Jawaban</label>
          <select 
            value={filters.answer_type}
            onChange={(e) => setFilters({...filters, answer_type: e.target.value})}
          >
            <option value="">Semua</option>
            <option value="essay">Essay</option>
            <option value="discussion">Discussion</option>
            <option value="challenge">Challenge</option>
            <option value="creative">Creative</option>
            <option value="reflective">Reflective</option>
          </select>
        </div>
        <div className="teacher-filter-item">
          <label>Urutkan</label>
          <select 
            value={filters.ordering}
            onChange={(e) => setFilters({...filters, ordering: e.target.value})}
          >
            <option value="-created_at">Terbaru</option>
            <option value="created_at">Terlama</option>
          </select>
        </div>
      </div>
      <button className="teacher-btn-primary" onClick={onSearch}>
        <span>🔍</span> Cari Jawaban
      </button>
    </div>
  );
};

const AnswerCard = ({ answer }) => {
  return (
    <div className="teacher-answer-card">
      <div className="teacher-answer-header">
        <div className="teacher-answer-student">
          <span className="teacher-icon">👤</span>
          <h3>{answer.nama_siswa}</h3>
        </div>
        <span className={`teacher-badge teacher-badge-${answer.tipe_jawaban}`}>
          {answer.tipe_jawaban}
        </span>
      </div>
      
      <div className="teacher-answer-activity">
        <span className="teacher-icon">📚</span>
        <strong>{answer.kegiatan}</strong>
      </div>

      <div className="teacher-answer-question">
        <label>Pertanyaan:</label>
        <p>{answer.pertanyaan}</p>
      </div>

      <div className="teacher-answer-text">
        <label>Jawaban:</label>
        <p>{answer.jawaban_siswa}</p>
      </div>

      <div className="teacher-answer-footer">
        <span className="teacher-answer-date">
          <span className="teacher-icon">📅</span>
          {answer.tanggal_dikirim}
        </span>
      </div>
    </div>
  );
};

const Answers = () => {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    q: '',
    activity: '',
    answer_type: '',
    ordering: '-created_at'
  });

  useEffect(() => {
    fetchAnswers();
  }, []);

  const fetchAnswers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.q) params.append('q', filters.q);
      if (filters.activity) params.append('activity', filters.activity);
      if (filters.answer_type) params.append('answer_type', filters.answer_type);
      if (filters.ordering) params.append('ordering', filters.ordering);

      const response = await fetch(`${API_BASE}/teacher/answers/?${params}`);
      if (!response.ok) throw new Error('Gagal mengambil data jawaban');
      
      const result = await response.json();
      setAnswers(result.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="teacher-page-container">
        <div className="teacher-loading-container">
          <div className="teacher-spinner"></div>
          <p>Memuat jawaban siswa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-page-container">
      
      <AnswersFilters filters={filters} setFilters={setFilters} onSearch={fetchAnswers} />
      
      {answers.length === 0 ? (
        <div className="teacher-empty-state">
          <span className="teacher-empty-icon">📭</span>
          <h3>Tidak Ada Jawaban</h3>
          <p>Belum ada jawaban yang dikumpulkan</p>
        </div>
      ) : (
        <div className="teacher-answers-grid">
          {answers.map((answer, idx) => (
            <AnswerCard key={idx} answer={answer} />
          ))}
        </div>
      )}
    </div>
  );
};

// ==================== KOMPONEN FEEDBACK ====================
const FeedbackCard = ({ feedback }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="teacher-feedback-card">
      <div className="teacher-feedback-header">
        <div className="teacher-user-info">
          <span className="teacher-icon">👤</span>
          <h3>{feedback.nama || 'Anonim'}</h3>
        </div>
      </div>

      {feedback.email && (
        <div className="teacher-feedback-email">
          <span className="teacher-icon">✉️</span>
          <span>{feedback.email}</span>
        </div>
      )}

      <div className="teacher-feedback-message">
        <p>{feedback.pesan}</p>
      </div>

      <div className="teacher-feedback-date">
        <span className="teacher-icon">📅</span>
        <span>{formatDate(feedback.tanggal)}</span>
      </div>
    </div>
  );
};

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/feedback/`);
      if (!response.ok) throw new Error('Gagal mengambil data feedback');
      
      const data = await response.json();
      setFeedbacks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSortedFeedbacks = () => {
    const sorted = [...feedbacks];
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

  if (loading) {
    return (
      <div className="teacher-page-container">
        <div className="teacher-loading-container">
          <div className="teacher-spinner"></div>
          <p>Memuat feedback...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-page-container">

      <div className="teacher-feedback-sort">
        <label>Urutkan:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Terbaru</option>
          <option value="oldest">Terlama</option>
        </select>
      </div>

      {displayedFeedbacks.length === 0 ? (
        <div className="teacher-empty-state">
          <span className="teacher-empty-icon">💬</span>
          <h3>Belum Ada Feedback</h3>
          <p>Feedback akan muncul di sini setelah ada yang mengirim</p>
        </div>
      ) : (
        <div className="teacher-feedback-grid">
          {displayedFeedbacks.map((feedback) => (
            <FeedbackCard key={feedback.id} feedback={feedback} />
          ))}
        </div>
      )}
    </div>
  );
};

// ==================== KOMPONEN UTAMA ====================
const TeacherMonitoring = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <div className={isDark ? 'dark-mode' : ''}>
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
      />
      
      <div className="teacher-app-content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'answers' && <Answers />}
        {activeTab === 'feedback' && <Feedback />}
      </div>
    </div>
  );
};

export default TeacherMonitoring;
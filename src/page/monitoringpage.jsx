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
const DashboardFilters = ({ filters, setFilters, onSearch, onReset }) => {
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
            <option value="Belum Selesai">Belum Selesai</option>
            <option value="Belum Mulai">Belum Mulai</option>
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
            <option value="not_started">Not Started</option>
          </select>
        </div>
      </div>
      <div className="teacher-filter-actions">
        <button className="teacher-btn-primary" onClick={onSearch}>
          <span>🔍</span> Cari Data
        </button>
        <button className="teacher-btn-secondary" onClick={onReset}>
          <span>🔄</span> Reset
        </button>
      </div>
    </div>
  );
};

const DashboardTable = ({ data, loading, pagination, onPageChange }) => {
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
        <span className="teacher-empty-icon">🔭</span>
        <h3>Tidak Ada Data</h3>
        <p>Belum ada data siswa yang tersedia</p>
      </div>
    );
  }

  return (
    <>
      <div className="teacher-table-container">
        <table className="teacher-data-table">
          <thead>
            <tr>
              <th>Siswa</th>
              <th>Halaman</th>
              <th>Status Komik</th>
              <th>Kegiatan Terakhir</th>
              <th>Status Kegiatan</th>
              <th>Chat Status</th>
              <th>Jawaban</th>
              <th>Terakhir Aktif</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => {
              // Hitung nomor berdasarkan pagination
              const rowNumber = ((pagination.page - 1) * pagination.page_size) + idx + 1;
              
              return (
                <tr key={row.user_id || idx}>
                  <td className="teacher-student-name">
                    <strong>{row.siswa}</strong>
                  </td>
                  <td className="teacher-text-center">
                    {row.halaman_terakhir !== undefined ? row.halaman_terakhir : '-'}
                  </td>
                  <td>
                    <span className={`teacher-badge ${
                      row.status_komik === 'Selesai' 
                        ? 'teacher-badge-success' 
                        : row.status_komik === 'Belum Selesai'
                        ? 'teacher-badge-warning'
                        : 'teacher-badge-secondary'
                    }`}>
                      {row.status_komik || 'Belum Mulai'}
                    </span>
                  </td>
                  <td className="teacher-activity-cell">
                    {row.kegiatan_terakhir || row.current_step || '-'}
                  </td>
                  <td>
                    <span className={`teacher-badge ${
                      row.status_kegiatan === 'completed' 
                        ? 'teacher-badge-success' 
                        : row.status_kegiatan === 'in_progress' || row.status_kegiatan === 'started'
                        ? 'teacher-badge-info'
                        : 'teacher-badge-secondary'
                    }`}>
                      {row.status_kegiatan || 'not_started'}
                    </span>
                  </td>
                  <td>
                    <span className={`teacher-badge ${
                      row.chat_status === 'completed' 
                        ? 'teacher-badge-success' 
                        : row.chat_status === 'active' 
                        ? 'teacher-badge-info' 
                        : 'teacher-badge-secondary'
                    }`}>
                      {row.chat_status || 'not_started'}
                    </span>
                  </td>
                  <td className="teacher-answers-count">
                    <span className="teacher-count-badge">
                      {row.jawaban_terkumpul || 0}
                    </span>
                  </td>
                  <td className="teacher-date-cell">
                    {row.terakhir_aktif}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <div className="teacher-pagination">
          <button 
            className="teacher-pagination-btn"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={!pagination.has_previous}
          >
            ← Previous
          </button>
          
          <span className="teacher-pagination-info">
            Page {pagination.page} of {pagination.total_pages} 
            <span className="teacher-pagination-total">
              ({pagination.total_items} total)
            </span>
          </span>
          
          <button 
            className="teacher-pagination-btn"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={!pagination.has_next}
          >
            Next →
          </button>
        </div>
      )}
    </>
  );
};

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 25,
    total_pages: 0,
    total_items: 0,
    has_next: false,
    has_previous: false
  });
  const [filters, setFilters] = useState({
    username: '',
    komik: '',
    status_komik: '',
    chat_status: ''
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('page_size', pagination.page_size);
      
      if (filters.username) params.append('username', filters.username);
      if (filters.komik) params.append('komik', filters.komik);
      if (filters.status_komik) params.append('status_komik', filters.status_komik);
      if (filters.chat_status) params.append('chat_status', filters.chat_status);

      const response = await fetch(`${API_BASE}/teacher/dashboard/?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      setData(result.results || []);
      setPagination(result.meta || pagination);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    fetchDashboard(newPage);
  };

  const handleSearch = () => {
    fetchDashboard(1); // Reset ke halaman 1 saat search
  };

  const handleReset = () => {
    setFilters({
      username: '',
      komik: '',
      status_komik: '',
      chat_status: ''
    });
    // Trigger fetch setelah reset
    setTimeout(() => fetchDashboard(1), 0);
  };

  return (
    <div className="teacher-page-container">
      <div className="teacher-page-header">
        <h2>📊 Dashboard Monitoring Siswa</h2>
        <p>Monitor progress siswa dalam menyelesaikan komik dan kegiatan pembelajaran</p>
      </div>

      {error && (
        <div className="teacher-error-message">
          <span>⚠️</span> Error: {error}
        </div>
      )}

      <DashboardFilters 
        filters={filters} 
        setFilters={setFilters} 
        onSearch={handleSearch}
        onReset={handleReset}
      />
      
      <DashboardTable 
        data={data} 
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

// ==================== KOMPONEN JAWABAN SISWA ====================
const AnswersFilters = ({ filters, setFilters, onSearch, onReset }) => {
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
          <select 
            value={filters.activity}
            onChange={(e) => setFilters({...filters, activity: e.target.value})}
          >
            <option value="">Semua Kegiatan</option>
            <option value="pertanyaan_1">pertanyaan_1</option>
            <option value="pertanyaan_2">pertanyaan_2</option>
            <option value="pertanyaan_3">pertanyaan_3</option>
            <option value="pertanyaan_4">pertanyaan_4</option>
            <option value="mari_merancang">mari_merancang</option>
            <option value="ayo_berkreasi">ayo_berkreasi</option>
            <option value="pertanyaan_reflektif">pertanyaan_reflektif</option>
          </select>
        </div>
        <div className="teacher-filter-item">
          <label>Tipe Jawaban</label>
          <select 
            value={filters.answer_type}
            onChange={(e) => setFilters({...filters, answer_type: e.target.value})}
          >
            <option value="">Semua Tipe</option>
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
      <div className="teacher-filter-actions">
        <button className="teacher-btn-primary" onClick={onSearch}>
          <span>🔍</span> Cari Jawaban
        </button>
        <button className="teacher-btn-secondary" onClick={onReset}>
          <span>🔄</span> Reset
        </button>
      </div>
    </div>
  );
};

const AnswerCard = ({ answer }) => {
  return (
    <div className="teacher-answer-card">
      <div className="teacher-answer-header">
        <div className="teacher-answer-student">
          <span className="teacher-icon">👤</span>
          <div>
            <h3>{answer.nama_siswa}</h3>
            <span className="teacher-answer-id">ID: {answer.id}</span>
          </div>
        </div>
        <div className="teacher-answer-badges">
          <span className={`teacher-badge teacher-badge-${answer.tipe_jawaban}`}>
            {answer.tipe_jawaban || answer.jenis_pertanyaan}
          </span>
          {answer.status && (
            <span className={`teacher-badge ${
              answer.status === 'Submitted' 
                ? 'teacher-badge-success' 
                : 'teacher-badge-warning'
            }`}>
              {answer.status}
            </span>
          )}
        </div>
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

      {/* Tampilkan gambar jika ada */}
      {answer.image_url && (
        <div className="teacher-answer-image">
          <label>Lampiran Gambar:</label>
          <img 
            src={answer.image_url} 
            alt="Jawaban siswa" 
            className="teacher-answer-img"
          />
        </div>
      )}

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
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 25,
    total_pages: 0,
    total_items: 0,
    has_next: false,
    has_previous: false
  });
  const [filters, setFilters] = useState({
    q: '',
    activity: '',
    answer_type: '',
    ordering: '-created_at'
  });

  useEffect(() => {
    fetchAnswers();
  }, []);

  const fetchAnswers = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('page_size', pagination.page_size);
      
      if (filters.q) params.append('q', filters.q);
      if (filters.activity) params.append('activity', filters.activity);
      if (filters.answer_type) params.append('answer_type', filters.answer_type);
      if (filters.ordering) params.append('ordering', filters.ordering);

      const response = await fetch(`${API_BASE}/teacher/answers/?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setAnswers(result.results || []);
      setPagination(result.meta || pagination);
    } catch (err) {
      console.error('Error fetching answers:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    fetchAnswers(newPage);
  };

  const handleSearch = () => {
    fetchAnswers(1);
  };

  const handleReset = () => {
    setFilters({
      q: '',
      activity: '',
      answer_type: '',
      ordering: '-created_at'
    });
    setTimeout(() => fetchAnswers(1), 0);
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
      <div className="teacher-page-header">
        <h2>📝 Jawaban Siswa</h2>
        <p>Lihat dan review jawaban yang dikumpulkan oleh siswa</p>
      </div>

      {error && (
        <div className="teacher-error-message">
          <span>⚠️</span> Error: {error}
        </div>
      )}
      
      <AnswersFilters 
        filters={filters} 
        setFilters={setFilters} 
        onSearch={handleSearch}
        onReset={handleReset}
      />
      
      {answers.length === 0 ? (
        <div className="teacher-empty-state">
          <span className="teacher-empty-icon">🔭</span>
          <h3>Tidak Ada Jawaban</h3>
          <p>Belum ada jawaban yang dikumpulkan atau sesuai filter</p>
        </div>
      ) : (
        <>
          <div className="teacher-answers-grid">
            {answers.map((answer) => (
              <AnswerCard key={answer.id} answer={answer} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.total_pages > 1 && (
            <div className="teacher-pagination">
              <button 
                className="teacher-pagination-btn"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.has_previous}
              >
                ← Previous
              </button>
              
              <span className="teacher-pagination-info">
                Page {pagination.page} of {pagination.total_pages}
                <span className="teacher-pagination-total">
                  ({pagination.total_items} jawaban)
                </span>
              </span>
              
              <button 
                className="teacher-pagination-btn"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.has_next}
              >
                Next →
              </button>
            </div>
          )}
        </>
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
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE}/feedback/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setFeedbacks(data);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      setError(err.message);
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
      <div className="teacher-page-header">
        <h2>💬 Feedback dari Pengguna</h2>
        <p>Lihat feedback dan masukan dari pengguna aplikasi</p>
      </div>

      {error && (
        <div className="teacher-error-message">
          <span>⚠️</span> Error: {error}
        </div>
      )}

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
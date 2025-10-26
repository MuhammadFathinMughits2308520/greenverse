import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/teacherLogin.css';
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const TeacherLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Kirim request ke backend untuk verifikasi password
      const response = await fetch(`${API_BASE}/teacher/verify-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Simpan token/flag di localStorage
        localStorage.setItem('teacher_authenticated', 'true');
        localStorage.setItem('teacher_auth_time', Date.now().toString());
        
        // Redirect ke halaman monitoring
        navigate('/teacher');
      } else {
        setError('Password salah! Silakan coba lagi.');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Pastikan backend berjalan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="teacher-login-container">
      <div className="teacher-login-card">
        <div className="teacher-login-header">
          <div className="teacher-login-icon">🔐</div>
          <h1>Portal Guru</h1>
          <p>Masukkan password untuk mengakses dashboard monitoring</p>
        </div>

        <form onSubmit={handleSubmit} className="teacher-login-form">
          <div className="teacher-form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password guru"
              required
              autoFocus
            />
          </div>

          {error && (
            <div className="teacher-error-message">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            className="teacher-login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Memverifikasi...
              </>
            ) : (
              <>
                <span>🔓</span>
                Masuk
              </>
            )}
          </button>
        </form>

        <div className="teacher-login-footer">
          <p>Halaman ini dilindungi untuk keamanan data siswa</p>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;
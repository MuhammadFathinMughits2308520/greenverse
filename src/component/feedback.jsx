// src/page/Feedback.jsx
import React, { useState } from 'react';
import '../styles/feedback.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://backendecombot-production.up.railway.app/api';

export default function FeedbackPage() {
  const [form, setForm] = useState({ nama: '', email: '', pesan: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const validate = () => {
    if (!form.nama.trim()) return 'Nama tidak boleh kosong';
    if (!form.email.trim()) return 'Email tidak boleh kosong';
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(form.email)) return 'Email tidak valid';
    if (!form.pesan.trim()) return 'Pesan tidak boleh kosong';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg('');
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/feedback/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: form.nama,
          email: form.email,
          pesan: form.pesan
        }),
      });

      if (res.status === 201 || res.ok) {
        setSuccessMsg('Feedback berhasil dikirim — terima kasih!');
        setForm({ nama: '', email: '', pesan: '' });
        setTimeout(() => setSuccessMsg(''), 5000);
      } else {
        const data = await res.json().catch(() => ({}));
        const msg = data?.message || JSON.stringify(data) || `Error ${res.status}`;
        setError(`Gagal mengirim: ${msg}`);
      }
    } catch (err) {
      setError('Gagal mengirim feedback. Periksa koneksi atau backend.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="feedback-page">
      <div className="feedback-container">
        <h2 className="feedback-title">Feedback</h2>

        <div className="feedback-card">
          <form className="feedback-form" onSubmit={handleSubmit} noValidate>
            <label className="field">
              <span className="field-label">Nama</span>
              <input
                type="text"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                placeholder="Nama lengkap"
                required
                className="field-input"
              />
            </label>

            <label className="field">
              <span className="field-label">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@domain.com"
                required
                className="field-input"
              />
            </label>

            <label className="field">
              <span className="field-label">Pesan</span>
              <textarea
                rows="6"
                value={form.pesan}
                onChange={(e) => setForm({ ...form, pesan: e.target.value })}
                placeholder="Tulis pesan atau masukan di sini..."
                required
                className="field-textarea"
              />
            </label>

            <div className="feedback-actions">
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Mengirim...' : 'Kirim Feedback'}
              </button>

              <button
                type="button"
                className="btn-plain"
                onClick={() => { setForm({ nama: '', email: '', pesan: '' }); setError(null); setSuccessMsg(''); }}
              >
                Reset
              </button>
            </div>

            {error && <div className="feedback-error" role="alert">{error}</div>}
            {successMsg && <div className="feedback-success" role="status">{successMsg}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Navigate } from 'react-router-dom';

const TeacherProtectedRoute = ({ children }) => {
  // Cek apakah teacher sudah login
  const isAuthenticated = localStorage.getItem('teacher_authenticated');
  const authTime = localStorage.getItem('teacher_auth_time');
  
  // Timeout session: 24 jam (86400000 ms)
  const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;
  
  if (!isAuthenticated || !authTime) {
    // Belum login, redirect ke halaman login
    return <Navigate to="/teacher/login" replace />;
  }
  
  // Cek apakah session sudah expired
  const currentTime = Date.now();
  const timeDiff = currentTime - parseInt(authTime);
  
  if (timeDiff > SESSION_TIMEOUT) {
    // Session expired, hapus data dan redirect ke login
    localStorage.removeItem('teacher_authenticated');
    localStorage.removeItem('teacher_auth_time');
    return <Navigate to="/teacher/login" replace />;
  }
  
  // Authenticated dan session masih valid
  return children;
};

export default TeacherProtectedRoute;
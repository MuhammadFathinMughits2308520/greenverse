import { useState, useEffect } from 'react';

// Helper: ambil token JWT (jika ada)
const getAuthHeader = () => {
  const token = localStorage.getItem("access");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const useChatFlow = () => {
  const [chatFlow, setChatFlow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChatFlow = async () => {
      try {
        // Coba fetch dari backend terlebih dahulu
        const token = localStorage.getItem("access");
        if (token) {
          try {
            const response = await fetch(`${API_BASE_URL}/chat/flow/`, {
              headers: getAuthHeader()
            });
            
            if (response.ok) {
              const data = await response.json();
              setChatFlow(data);
              setLoading(false);
              return;
            }
          } catch (backendError) {
            console.warn('Backend chat flow not available, using fallback');
          }
        }
        
        // Fallback ke file lokal
        const response = await fetch('/data/chat.json');
        if (!response.ok) {
          throw new Error('Failed to fetch chat flow');
        }
        const data = await response.json();
        setChatFlow(data);
      } catch (err) {
        setError(err.message);
        console.error('Error loading chat flow:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatFlow();
  }, []);

  return { chatFlow, loading, error };
};
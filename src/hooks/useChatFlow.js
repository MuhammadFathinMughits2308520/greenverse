import { useState, useEffect } from 'react';

const API_BASE_URL = 'https://backendecombot-production.up.railway.app/api';

export const useChatFlow = () => {
  const [chatFlow, setChatFlow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChatFlow = async () => {
      try {
        // Coba fetch dari backend Django dulu
        const token = localStorage.getItem('token');
        
        if (token) {
          try {
            const response = await fetch(`${API_BASE_URL}/chat/flow/`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              setChatFlow(data);
              setLoading(false);
              return;
            }
          } catch (backendError) {
            console.log('Backend chat flow not available, using local JSON');
          }
        }

        // Fallback ke file JSON lokal
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
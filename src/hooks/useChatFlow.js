import { useState, useEffect } from 'react';

export const useChatFlow = () => {
  const [chatFlow, setChatFlow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChatFlow = async () => {
      try {
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
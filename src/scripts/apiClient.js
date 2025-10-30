// apiClient.js - Utility untuk handle API calls dengan auto-refresh token

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

/**
 * Refresh access token menggunakan refresh token
 */
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refresh');
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    localStorage.setItem('access', data.access);
    
    console.log('✅ Access token refreshed successfully');
    return data.access;
    
  } catch (error) {
    console.error('❌ Token refresh error:', error);
    
    // Hapus token yang invalid
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    
    // Trigger logout event
    window.dispatchEvent(new Event('logout'));
    
    // Redirect ke login
    window.location.href = '/login';
    
    throw error;
  }
};

/**
 * Enhanced fetch dengan auto-retry dan token refresh
 */
export const apiClient = async (url, options = {}) => {
  const token = localStorage.getItem('access');
  
  // Prepare headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Prepare request options
  const requestOptions = {
    ...options,
    headers,
  };

  try {
    // Attempt request
    let response = await fetch(url, requestOptions);

    // Check for 401 Unauthorized
    if (response.status === 401) {
      console.log('⚠️ 401 Unauthorized - Attempting token refresh...');
      
      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            requestOptions.headers['Authorization'] = `Bearer ${token}`;
            return fetch(url, requestOptions);
          })
          .catch(err => {
            throw err;
          });
      }

      isRefreshing = true;

      try {
        // Refresh token
        const newToken = await refreshAccessToken();
        
        // Update request header with new token
        requestOptions.headers['Authorization'] = `Bearer ${newToken}`;
        
        // Process queued requests
        processQueue(null, newToken);
        
        // Retry original request with new token
        response = await fetch(url, requestOptions);
        
        isRefreshing = false;
        
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        throw refreshError;
      }
    }

    // Check for other errors
    if (!response.ok && response.status !== 401) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response;
    
  } catch (error) {
    console.error('API Client Error:', error);
    throw error;
  }
};

/**
 * Helper untuk GET requests
 */
export const apiGet = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const response = await apiClient(url, {
    method: 'GET',
    ...options,
  });
  return response.json();
};

/**
 * Helper untuk POST requests
 */
export const apiPost = async (endpoint, data, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const response = await apiClient(url, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });
  return response.json();
};

/**
 * Helper untuk PUT requests
 */
export const apiPut = async (endpoint, data, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const response = await apiClient(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  });
  return response.json();
};

/**
 * Helper untuk DELETE requests
 */
export const apiDelete = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const response = await apiClient(url, {
    method: 'DELETE',
    ...options,
  });
  return response.json();
};

/**
 * Get auth header (legacy support)
 */
export const getAuthHeader = () => {
  const token = localStorage.getItem("access");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default apiClient;
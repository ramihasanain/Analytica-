import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api', // Using Vite proxy for local dev, VITE_API_URL for production
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to add Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  // Do not attach token for login or signup to prevent 401 on invalid old tokens
  const isAuthRequest = config.url === '/token-auth/' || (config.url === '/users/' && config.method === 'post');
  
  if (token && !isAuthRequest) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor to handle global errors (e.g., 401 Unauthorized)
api.interceptors.response.use((response) => response, (error) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/auth'; // Redirect to login on token expiration
  }
  return Promise.reject(error);
});

export default api;

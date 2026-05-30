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
  const isAuthRequest = [
    '/token-auth/',
    '/auth/login/',
    '/auth/google/url/',
    '/auth/google/callback/',
    '/auth/totp/confirm-setup/',
    '/auth/totp/verify/',
  ].some((path) => config.url === path || config.url?.endsWith(path))
    || (config.url === '/users/' && config.method === 'post');
  
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
    const onAuthPage = window.location.pathname.startsWith('/auth');
    if (!onAuthPage) {
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
  }
  return Promise.reject(error);
});

export default api;

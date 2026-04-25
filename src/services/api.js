import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Using Vite proxy
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to add Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
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

import axios from 'axios';

const API_BASE_URL = 'https://frontend-task-chatapp.onrender.com/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to attach JWT token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('chat_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

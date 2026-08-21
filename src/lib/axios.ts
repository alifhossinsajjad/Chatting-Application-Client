import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://frontend-task-chatapp.onrender.com/api';

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

// Helper to recursively map _id to id in backend responses
const mapIds = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(mapIds);
  } else if (obj !== null && typeof obj === 'object') {
    const newObj: any = {};
    for (const key in obj) {
      if (key === '_id') {
        newObj['id'] = obj[key];
        newObj['_id'] = obj[key];
      } else if (key === 'sender' && typeof obj[key] === 'string') {
        newObj['senderId'] = obj[key];
        newObj['sender'] = obj[key];
      } else if (key === 'conversation' && typeof obj[key] === 'string') {
        newObj['conversationId'] = obj[key];
        newObj['conversation'] = obj[key];
      } else {
        newObj[key] = mapIds(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
};

// Interceptor to map _id to id in responses
api.interceptors.response.use((response) => {
  if (response.data) {
    response.data = mapIds(response.data);
  }
  return response;
});

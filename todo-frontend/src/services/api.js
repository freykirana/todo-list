import axios from 'axios';

// Smart API URL detection:
// - On tunnel (trycloudflare.com): use same origin (Nginx proxies /api to backend)
// - On localhost: use localhost:4000 directly
const getAPIURL = () => {
  if (typeof window !== 'undefined' && window.location.hostname.includes('trycloudflare.com')) {
    return window.location.origin; // Nginx will handle /api routing
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:4000';
};

const API_URL = getAPIURL();

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API calls
export const authAPI = {
  register: (nama, email, password) =>
    apiClient.post('/api/auth/register', { nama, email, password }),
  login: (email, password) =>
    apiClient.post('/api/auth/login', { email, password }),
};

// Tasks API calls
export const tasksAPI = {
  getTasks: (search = '', status = '', categoryId = '') =>
    apiClient.get('/api/tasks', { params: { search, status, categoryId } }),
  getTaskById: (id) => apiClient.get(`/api/tasks/${id}`),
  createTask: (task) => apiClient.post('/api/tasks', task),
  updateTask: (id, task) => apiClient.put(`/api/tasks/${id}`, task),
  deleteTask: (id) => apiClient.delete(`/api/tasks/${id}`),
};

// Categories API calls
export const categoriesAPI = {
  getCategories: () => apiClient.get('/api/categories'),
  createCategory: (data) => apiClient.post('/api/categories', data),
  create: (data) => apiClient.post('/api/categories', data),
};

export default apiClient;
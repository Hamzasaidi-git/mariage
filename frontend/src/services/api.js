import axios from 'axios';

// Configuration de base
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Instance axios avec configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Services d'authentification
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Services des prestataires
export const prestataireService = {
  getAll: async (params = {}) => {
    const response = await api.get('/prestataires', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/prestataires/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/prestataires', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/prestataires/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/prestataires/${id}`);
    return response.data;
  },

  search: async (query) => {
    const response = await api.get(`/prestataires/search`, { params: query });
    return response.data;
  },

  getByCategory: async (categoryId) => {
    const response = await api.get(`/prestataires/category/${categoryId}`);
    return response.data;
  },
};

// Services des catégories
export const categoryService = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

// Services des avis
export const avisService = {
  getAll: async (params = {}) => {
    const response = await api.get('/avis', { params });
    return response.data;
  },

  getByPrestataire: async (prestataireId) => {
    const response = await api.get(`/avis/prestataire/${prestataireId}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/avis', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/avis/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/avis/${id}`);
    return response.data;
  },

  approve: async (id) => {
    const response = await api.patch(`/avis/${id}/approve`);
    return response.data;
  },

  reject: async (id) => {
    const response = await api.patch(`/avis/${id}/reject`);
    return response.data;
  },
};

// Services des messages
export const messageService = {
  getAll: async () => {
    const response = await api.get('/messages');
    return response.data;
  },

  getByConversation: async (prestataireId) => {
    const response = await api.get(`/messages/conversation/${prestataireId}`);
    return response.data;
  },

  send: async (data) => {
    const response = await api.post('/messages', data);
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.patch(`/messages/${id}/read`);
    return response.data;
  },
};

// Services d'upload
export const uploadService = {
  uploadImage: async (file, folder = 'general') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadMultiple: async (files, folder = 'general') => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    formData.append('folder', folder);

    const response = await api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteImage: async (filename) => {
    const response = await api.delete(`/upload/image/${filename}`);
    return response.data;
  },
};

// Services statistiques (pour admin)
export const statsService = {
  getDashboard: async () => {
    const response = await api.get('/admin/stats/dashboard');
    return response.data;
  },

  getPrestataires: async () => {
    const response = await api.get('/admin/stats/prestataires');
    return response.data;
  },

  getUsers: async () => {
    const response = await api.get('/admin/stats/users');
    return response.data;
  },
};

// Export par défaut
export default api;
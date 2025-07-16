// Service API pour communiquer avec le backend
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

// Configuration de base d'Axios
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      Cookies.remove('token');
      Cookies.remove('user');
      window.location.href = '/login';
    }
    
    // Afficher les erreurs si ce n'est pas une requête silencieuse
    if (!error.config?.silent) {
      const message = error.response?.data?.error || 'Une erreur est survenue';
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// Services d'authentification
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.post('/auth/change-password', data),
  getUsers: (params) => api.get('/auth/users', { params }),
};

// Services des prestataires
export const prestatairesAPI = {
  getAll: (params) => api.get('/prestataires', { params }),
  getById: (id) => api.get(`/prestataires/${id}`),
  create: (data) => api.post('/prestataires', data),
  update: (id, data) => api.put(`/prestataires/${id}`, data),
  delete: (id) => api.delete(`/prestataires/${id}`),
  getFeatured: (params) => api.get('/prestataires/featured', { params }),
  getVilles: () => api.get('/prestataires/villes'),
  getSimilaires: (id, params) => api.get(`/prestataires/${id}/similaires`, { params }),
  getAdminAll: (params) => api.get('/prestataires/admin/all', { params }),
};

// Services des catégories
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
  getPrestataires: (nom, params) => api.get(`/categories/${nom}/prestataires`, { params }),
};

// Services des messages
export const messagesAPI = {
  send: (data) => api.post('/messages', data),
  getByPrestataire: (prestataireId, params) => api.get(`/messages/prestataire/${prestataireId}`, { params }),
  getAdmin: (params) => api.get('/messages/admin', { params }),
  getById: (id) => api.get(`/messages/${id}`),
  markAsRead: (id) => api.put(`/messages/${id}/marquer-lu`),
  markAsUnread: (id) => api.put(`/messages/${id}/marquer-non-lu`),
  delete: (id) => api.delete(`/messages/${id}`),
  getStats: () => api.get('/messages/stats/dashboard'),
};

// Services des avis
export const avisAPI = {
  create: (data) => api.post('/avis', data),
  getByPrestataire: (prestataireId, params) => api.get(`/avis/prestataire/${prestataireId}`, { params }),
  getAdmin: (params) => api.get('/avis/admin', { params }),
  getById: (id) => api.get(`/avis/${id}`),
  update: (id, data) => api.put(`/avis/${id}`, data),
  delete: (id) => api.delete(`/avis/${id}`),
  getGlobalStats: () => api.get('/avis/stats/global'),
  getPrestataireStats: (prestataireId) => api.get(`/avis/prestataire/${prestataireId}/stats`),
};

// Services d'upload
export const uploadAPI = {
  single: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  multiple: (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    return api.post('/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  delete: (filename) => api.delete(`/upload/${filename}`),
  list: () => api.get('/upload/list'),
  getInfo: (filename) => api.get(`/upload/info/${filename}`),
};

// Service de recherche générale
export const searchAPI = {
  global: (query, params) => api.get('/prestataires', { 
    params: { search: query, ...params } 
  }),
  suggestions: (query) => api.get('/prestataires', { 
    params: { search: query, limit: 5 },
    silent: true // Ne pas afficher les erreurs
  }),
};

// Service de géolocalisation et cartes
export const locationAPI = {
  getVilles: () => prestatairesAPI.getVilles(),
  searchByLocation: (location, params) => api.get('/prestataires', {
    params: { ville: location, ...params }
  }),
};

// Service de statistiques globales
export const statsAPI = {
  getDashboard: () => api.get('/messages/stats/dashboard'),
  getGlobalAvis: () => avisAPI.getGlobalStats(),
  getHealth: () => api.get('/health'),
};

// Helpers pour la gestion des erreurs
export const handleApiError = (error) => {
  if (error.response) {
    // Erreur de réponse du serveur
    return {
      message: error.response.data?.error || 'Erreur du serveur',
      status: error.response.status,
      data: error.response.data
    };
  } else if (error.request) {
    // Pas de réponse du serveur
    return {
      message: 'Impossible de contacter le serveur',
      status: 0,
      data: null
    };
  } else {
    // Erreur de configuration
    return {
      message: error.message || 'Erreur inconnue',
      status: -1,
      data: null
    };
  }
};

// Helper pour les requêtes avec cache personnalisé
export const createCachedRequest = (requestFn, cacheKey, ttl = 5 * 60 * 1000) => {
  const cache = new Map();
  
  return async (...args) => {
    const key = `${cacheKey}-${JSON.stringify(args)}`;
    const cached = cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }
    
    try {
      const response = await requestFn(...args);
      cache.set(key, {
        data: response,
        timestamp: Date.now()
      });
      return response;
    } catch (error) {
      cache.delete(key);
      throw error;
    }
  };
};

export default api;
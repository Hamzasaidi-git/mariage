// Configuration générale de l'application
export const APP_CONFIG = {
  name: 'Annuaire Mariage Tunisie',
  description: 'Trouvez les meilleurs prestataires pour votre mariage en Tunisie',
  version: '1.0.0',
  contact: {
    email: 'contact@mariage-tunisie.com',
    phone: '+216 98 123 456',
    address: 'Tunis, Tunisie'
  }
};

// URLs et endpoints
export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  AUTH: '/auth',
  PRESTATAIRES: '/prestataires',
  CATEGORIES: '/categories',
  AVIS: '/avis',
  MESSAGES: '/messages',
  UPLOAD: '/upload'
};

// Rôles utilisateurs
export const USER_ROLES = {
  CLIENT: 'CLIENT',
  PRESTATAIRE: 'PRESTATAIRE',
  ADMIN: 'ADMIN'
};

// Types de catégories de services
export const CATEGORIES = {
  SALLES: 'Salles de réception',
  TRAITEUR: 'Traiteur',
  PHOTOGRAPHE: 'Photographe',
  COIFFURE: 'Coiffure',
  MAQUILLAGE: 'Maquillage',
  BIJOUX: 'Bijouterie',
  COUTURE: 'Couture',
  VOYAGE: 'Voyage de noces'
};

// Villes principales de Tunisie
export const TUNISIAN_CITIES = [
  'Tunis',
  'Sfax', 
  'Sousse',
  'Kairouan',
  'Bizerte',
  'Gabès',
  'Ariana',
  'Gafsa',
  'Monastir',
  'Ben Arous',
  'Kasserine',
  'Mahdia',
  'Médenine',
  'Nabeul',
  'Sidi Bouzid',
  'Siliana',
  'Tataouine',
  'Tozeur',
  'Zaghouan',
  'Kef',
  'Jendouba',
  'Kébili',
  'Béja',
  'Manouba'
];

// Régions de Tunisie
export const TUNISIAN_REGIONS = [
  'Grand Tunis',
  'Nord-Est',
  'Nord-Ouest', 
  'Centre-Est',
  'Centre-Ouest',
  'Sud-Est',
  'Sud-Ouest'
];

// Statuts des avis
export const AVIS_STATUS = {
  EN_ATTENTE: 'EN_ATTENTE',
  APPROUVE: 'APPROUVE',
  REJETE: 'REJETE'
};

// Pagination par défaut
export const PAGINATION = {
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100
};

// Messages d'erreur communs
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion. Vérifiez votre connexion internet.',
  UNAUTHORIZED: 'Vous devez être connecté pour effectuer cette action.',
  FORBIDDEN: 'Vous n\'avez pas les permissions nécessaires.',
  NOT_FOUND: 'Ressource non trouvée.',
  SERVER_ERROR: 'Erreur serveur. Veuillez réessayer plus tard.',
  VALIDATION_ERROR: 'Données invalides. Vérifiez vos informations.'
};

// Messages de succès
export const SUCCESS_MESSAGES = {
  LOGIN: 'Connexion réussie !',
  LOGOUT: 'Déconnexion réussie !',
  REGISTER: 'Inscription réussie !',
  PROFILE_UPDATED: 'Profil mis à jour avec succès !',
  REVIEW_ADDED: 'Avis ajouté avec succès !',
  MESSAGE_SENT: 'Message envoyé avec succès !'
};

// Configuration des filtres de recherche
export const SEARCH_FILTERS = {
  PRICE_RANGES: [
    { label: 'Moins de 500 DT', min: 0, max: 500 },
    { label: '500 - 1000 DT', min: 500, max: 1000 },
    { label: '1000 - 2000 DT', min: 1000, max: 2000 },
    { label: '2000 - 5000 DT', min: 2000, max: 5000 },
    { label: 'Plus de 5000 DT', min: 5000, max: null }
  ],
  RATING_OPTIONS: [
    { label: '5 étoiles', value: 5 },
    { label: '4 étoiles et plus', value: 4 },
    { label: '3 étoiles et plus', value: 3 },
    { label: '2 étoiles et plus', value: 2 }
  ]
};

// Configuration des médias sociaux
export const SOCIAL_MEDIA = {
  FACEBOOK: 'https://facebook.com/mariagetunsie',
  INSTAGRAM: 'https://instagram.com/mariagetunsie',
  TWITTER: 'https://twitter.com/mariagetunsie',
  LINKEDIN: 'https://linkedin.com/company/mariagetunsie'
};

// Formats de fichiers acceptés
export const FILE_FORMATS = {
  IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  MAX_SIZE: 5 * 1024 * 1024 // 5MB
};

export default {
  APP_CONFIG,
  API_ENDPOINTS,
  USER_ROLES,
  CATEGORIES,
  TUNISIAN_CITIES,
  TUNISIAN_REGIONS,
  AVIS_STATUS,
  PAGINATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  SEARCH_FILTERS,
  SOCIAL_MEDIA,
  FILE_FORMATS
};
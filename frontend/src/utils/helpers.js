/**
 * Fonctions utilitaires pour l'application
 */

// Formatage des dates
export const formatDate = (dateString, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  return new Date(dateString).toLocaleDateString('fr-FR', defaultOptions);
};

// Formatage relatif des dates (il y a X temps)
export const formatRelativeDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return 'À l\'instant';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  } else {
    return formatDate(dateString);
  }
};

// Formatage des prix
export const formatPrice = (price, currency = 'DT') => {
  if (!price || price === 0) return 'Prix sur demande';
  return `${price.toLocaleString('fr-FR')} ${currency}`;
};

// Formatage des numéros de téléphone tunisiens
export const formatTunisianPhone = (phone) => {
  if (!phone) return '';
  
  // Nettoyer le numéro
  const cleaned = phone.replace(/\D/g, '');
  
  // Format tunisien : XX XXX XXX
  if (cleaned.length === 8) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})/, '$1 $2 $3');
  }
  
  return phone;
};

// Validation des emails
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validation des numéros de téléphone tunisiens
export const isValidTunisianPhone = (phone) => {
  const phoneRegex = /^[2-9]\d{7}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

// Génération d'URL WhatsApp
export const generateWhatsAppUrl = (phone, message = '') => {
  const cleanPhone = phone.replace(/\D/g, '');
  const tunisianPhone = cleanPhone.startsWith('216') ? cleanPhone : `216${cleanPhone}`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${tunisianPhone}${message ? `?text=${encodedMessage}` : ''}`;
};

// Génération d'initiales à partir d'un nom
export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Capitalisation de la première lettre
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Truncature de texte
export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Génération de slug à partir d'un titre
export const generateSlug = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Retirer les accents
    .replace(/[^a-z0-9\s-]/g, '') // Retirer les caractères spéciaux
    .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
    .replace(/-+/g, '-') // Retirer les tirets multiples
    .trim('-'); // Retirer les tirets en début/fin
};

// Debounce fonction
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Validation de la force du mot de passe
export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, text: '' };
  
  let score = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  
  score = Object.values(checks).filter(Boolean).length;
  
  const strength = {
    0: { score: 0, text: 'Très faible', color: 'red' },
    1: { score: 1, text: 'Faible', color: 'red' },
    2: { score: 2, text: 'Moyen', color: 'yellow' },
    3: { score: 3, text: 'Bon', color: 'blue' },
    4: { score: 4, text: 'Fort', color: 'green' },
    5: { score: 5, text: 'Très fort', color: 'green' }
  };
  
  return strength[score] || strength[0];
};

// Validation des fichiers
export const validateFile = (file, allowedTypes = [], maxSize = 5 * 1024 * 1024) => {
  const errors = [];
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    errors.push(`Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(', ')}`);
  }
  
  if (file.size > maxSize) {
    errors.push(`Fichier trop volumineux. Taille maximale: ${maxSize / (1024 * 1024)}MB`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Obtenir l'URL complète d'une image
export const getImageUrl = (imagePath, baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000') => {
  if (!imagePath) return '/images/placeholder-service.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  return `${baseUrl}${imagePath}`;
};

// Copier du texte dans le presse-papier
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback pour les navigateurs plus anciens
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackErr) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

// Mélanger un tableau (shuffle)
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Grouper des éléments par propriété
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
};

// Calculer la note moyenne
export const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((total, review) => total + review.note, 0);
  return Math.round((sum / reviews.length) * 10) / 10; // Arrondi à 1 décimale
};

export default {
  formatDate,
  formatRelativeDate,
  formatPrice,
  formatTunisianPhone,
  isValidEmail,
  isValidTunisianPhone,
  generateWhatsAppUrl,
  getInitials,
  capitalize,
  truncateText,
  generateSlug,
  debounce,
  getPasswordStrength,
  validateFile,
  getImageUrl,
  copyToClipboard,
  shuffleArray,
  groupBy,
  calculateAverageRating
};
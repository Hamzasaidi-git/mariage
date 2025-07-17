// Utilitaires d'authentification
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Générer un token JWT
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Hasher un mot de passe
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Comparer un mot de passe avec son hash
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Valider un email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Valider un mot de passe (au moins 6 caractères)
const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Valider un numéro de téléphone tunisien
const isValidTunisianPhone = (phone) => {
  if (!phone) return true; // Optionnel
  // Format tunisien: +216 ou 00216 suivi de 8 chiffres
  const phoneRegex = /^(\+216|00216|216)?[2-9][0-9]{7}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

module.exports = {
  generateToken,
  hashPassword,
  comparePassword,
  isValidEmail,
  isValidPassword,
  isValidTunisianPhone
};
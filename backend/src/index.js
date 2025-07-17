// Serveur principal pour l'annuaire de services de mariage
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Import des routes
const prestataireRoutes = require('./routes/prestataires');
const categoryRoutes = require('./routes/categories');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');
const avisRoutes = require('./routes/avis');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration de la limitation de taux
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite de 100 requêtes par fenêtre de temps
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
});

// Middlewares globaux
app.use(helmet()); // Sécurité
app.use(limiter); // Limitation de taux
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir les fichiers statiques (images uploadées)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes API
app.use('/api/prestataires', prestataireRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/avis', avisRoutes);
app.use('/api/upload', uploadRoutes);

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'API Annuaire Mariage Tunisie - Opérationnelle', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur:', err.stack);
  
  // Erreur de validation Prisma
  if (err.code === 'P2002') {
    return res.status(400).json({ 
      error: 'Violation de contrainte unique',
      details: err.meta 
    });
  }
  
  // Erreur JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Token invalide' });
  }
  
  // Erreur générale
  res.status(err.status || 500).json({ 
    error: err.message || 'Erreur interne du serveur' 
  });
});

// Route catch-all pour les routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
});
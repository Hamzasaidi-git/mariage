// Middleware d'authentification JWT
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Middleware pour vérifier le token JWT
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({ error: 'Token d\'accès requis' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Vérifier que l'utilisateur existe toujours
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, nom: true, actif: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }

    if (!user.actif) {
      return res.status(401).json({ error: 'Compte désactivé' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return res.status(403).json({ error: 'Token invalide' });
  }
};

// Middleware pour vérifier le rôle admin
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentification requise' });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Accès admin requis' });
  }

  next();
};

// Middleware pour vérifier le rôle prestataire ou admin
const requirePrestataireOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentification requise' });
  }

  if (req.user.role !== 'ADMIN' && req.user.role !== 'PRESTATAIRE') {
    return res.status(403).json({ error: 'Accès prestataire ou admin requis' });
  }

  next();
};

// Middleware pour vérifier la propriété d'une ressource (prestataire)
const requireOwnershipOrAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentification requise' });
    }

    // Admin peut tout faire
    if (req.user.role === 'ADMIN') {
      return next();
    }

    // Pour les prestataires, vérifier la propriété
    if (req.user.role === 'PRESTATAIRE') {
      const prestataireId = req.params.id || req.body.prestataireId;
      
      if (!prestataireId) {
        return res.status(400).json({ error: 'ID prestataire requis' });
      }

      const prestataire = await prisma.prestataire.findUnique({
        where: { id: prestataireId },
        select: { userId: true }
      });

      if (!prestataire) {
        return res.status(404).json({ error: 'Prestataire non trouvé' });
      }

      if (prestataire.userId !== req.user.id) {
        return res.status(403).json({ error: 'Accès non autorisé à cette ressource' });
      }

      return next();
    }

    return res.status(403).json({ error: 'Accès non autorisé' });
  } catch (error) {
    console.error('Erreur de vérification de propriété:', error);
    return res.status(500).json({ error: 'Erreur interne' });
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requirePrestataireOrAdmin,
  requireOwnershipOrAdmin
};
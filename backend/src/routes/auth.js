// Routes d'authentification
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { 
  generateToken, 
  hashPassword, 
  comparePassword,
  isValidEmail,
  isValidPassword,
  isValidTunisianPhone 
} = require('../utils/auth');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// @route POST /api/auth/login
// @desc Connexion utilisateur
// @access Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation des données
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Format d\'email invalide' });
    }

    // Rechercher l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        prestataire: {
          select: { id: true, nom: true }
        }
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    if (!user.actif) {
      return res.status(401).json({ error: 'Compte désactivé' });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    // Générer le token
    const token = generateToken(user.id);

    // Réponse sans le mot de passe
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Connexion réussie',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// @route POST /api/auth/register
// @desc Inscription utilisateur
// @access Public
router.post('/register', async (req, res) => {
  try {
    const { nom, email, password, tel, role } = req.body;

    // Validation des données
    if (!nom || !email || !password) {
      return res.status(400).json({ error: 'Nom, email et mot de passe requis' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Format d\'email invalide' });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
    }

    if (tel && !isValidTunisianPhone(tel)) {
      return res.status(400).json({ error: 'Format de téléphone invalide' });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    // Hasher le mot de passe
    const hashedPassword = await hashPassword(password);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        nom: nom.trim(),
        email: email.toLowerCase(),
        password: hashedPassword,
        tel: tel?.trim(),
        role: role === 'PRESTATAIRE' ? 'PRESTATAIRE' : 'CLIENT'
      }
    });

    // Générer le token
    const token = generateToken(user.id);

    // Réponse sans le mot de passe
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(201).json({
      message: 'Inscription réussie',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// @route GET /api/auth/me
// @desc Obtenir les informations de l'utilisateur connecté
// @access Private
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        nom: true,
        email: true,
        role: true,
        tel: true,
        actif: true,
        createdAt: true,
        prestataire: {
          select: {
            id: true,
            nom: true,
            ville: true,
            category: {
              select: { nom: true }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Erreur récupération profil:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// @route PUT /api/auth/profile
// @desc Mettre à jour le profil utilisateur
// @access Private
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { nom, tel } = req.body;

    // Validation
    if (tel && !isValidTunisianPhone(tel)) {
      return res.status(400).json({ error: 'Format de téléphone invalide' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(nom && { nom: nom.trim() }),
        ...(tel !== undefined && { tel: tel?.trim() || null })
      },
      select: {
        id: true,
        nom: true,
        email: true,
        role: true,
        tel: true,
        actif: true,
        createdAt: true
      }
    });

    res.json({
      message: 'Profil mis à jour avec succès',
      user: updatedUser
    });
  } catch (error) {
    console.error('Erreur mise à jour profil:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// @route POST /api/auth/change-password
// @desc Changer le mot de passe
// @access Private
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Mot de passe actuel et nouveau requis' });
    }

    if (!isValidPassword(newPassword)) {
      return res.status(400).json({ error: 'Le nouveau mot de passe doit contenir au moins 6 caractères' });
    }

    // Vérifier le mot de passe actuel
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Mot de passe actuel incorrect' });
    }

    // Hasher le nouveau mot de passe
    const hashedNewPassword = await hashPassword(newPassword);

    // Mettre à jour
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedNewPassword }
    });

    res.json({ message: 'Mot de passe changé avec succès' });
  } catch (error) {
    console.error('Erreur changement mot de passe:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// @route GET /api/auth/users
// @desc Liste des utilisateurs (admin seulement)
// @access Private (Admin)
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const where = {
      ...(role && { role }),
      ...(search && {
        OR: [
          { nom: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          nom: true,
          email: true,
          role: true,
          tel: true,
          actif: true,
          createdAt: true,
          prestataire: {
            select: { id: true, nom: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: parseInt(limit)
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erreur récupération utilisateurs:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;
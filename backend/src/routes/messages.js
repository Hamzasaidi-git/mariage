// Routes pour la gestion des messages
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireAdmin, requireOwnershipOrAdmin } = require('../middleware/auth');
const { isValidEmail, isValidTunisianPhone } = require('../utils/auth');

const router = express.Router();
const prisma = new PrismaClient();

// @route POST /api/messages
// @desc Envoyer un message à un prestataire
// @access Public
router.post('/', async (req, res) => {
  try {
    const {
      prestataireId,
      nom,
      email,
      tel,
      message,
      date_event,
      budget
    } = req.body;

    // Validation des champs requis
    if (!prestataireId || !nom || !email || !message) {
      return res.status(400).json({ 
        error: 'Prestataire, nom, email et message sont requis' 
      });
    }

    // Validation email
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Format d\'email invalide' });
    }

    // Validation téléphone (optionnel)
    if (tel && !isValidTunisianPhone(tel)) {
      return res.status(400).json({ error: 'Format de téléphone invalide' });
    }

    // Vérifier que le prestataire existe et est actif
    const prestataire = await prisma.prestataire.findUnique({
      where: { id: prestataireId },
      select: { id: true, nom: true, actif: true }
    });

    if (!prestataire) {
      return res.status(404).json({ error: 'Prestataire non trouvé' });
    }

    if (!prestataire.actif) {
      return res.status(400).json({ error: 'Ce prestataire n\'est plus disponible' });
    }

    // Créer le message
    const newMessage = await prisma.message.create({
      data: {
        prestataireId,
        nom: nom.trim(),
        email: email.toLowerCase().trim(),
        tel: tel?.trim(),
        message: message.trim(),
        date_event: date_event ? new Date(date_event) : null,
        budget: budget ? parseFloat(budget) : null
      },
      include: {
        prestataire: {
          select: { nom: true, category: { select: { nom: true } } }
        }
      }
    });

    res.status(201).json({
      message: 'Message envoyé avec succès',
      data: newMessage
    });
  } catch (error) {
    console.error('Erreur envoi message:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// @route GET /api/messages/prestataire/:prestataireId
// @desc Obtenir les messages d'un prestataire
// @access Private (Admin ou Propriétaire du prestataire)
router.get('/prestataire/:prestataireId', authenticateToken, async (req, res) => {
  try {
    const { prestataireId } = req.params;
    const { page = 1, limit = 20, lu } = req.query;
    
    // Vérifier les permissions
    if (req.user.role !== 'ADMIN') {
      const prestataire = await prisma.prestataire.findUnique({
        where: { id: prestataireId },
        select: { userId: true }
      });

      if (!prestataire || prestataire.userId !== req.user.id) {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      prestataireId,
      ...(lu !== undefined && { lu: lu === 'true' })
    };

    const [messages, total, nonLus] = await Promise.all([
      prisma.message.findMany({
        where,
        select: {
          id: true,
          nom: true,
          email: true,
          tel: true,
          message: true,
          date_event: true,
          budget: true,
          lu: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: parseInt(limit)
      }),
      prisma.message.count({ where }),
      prisma.message.count({ 
        where: { prestataireId, lu: false } 
      })
    ]);

    res.json({
      messages,
      stats: {
        total,
        nonLus
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erreur récupération messages prestataire:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// @route GET /api/messages/admin
// @desc Obtenir tous les messages (admin seulement)
// @access Private (Admin)
router.get('/admin', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50, search, lu, prestataireId } = req.query;
    
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      ...(search && {
        OR: [
          { nom: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { message: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(lu !== undefined && { lu: lu === 'true' }),
      ...(prestataireId && { prestataireId })
    };

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,
        include: {
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
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: parseInt(limit)
      }),
      prisma.message.count({ where })
    ]);

    res.json({
      messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erreur récupération messages admin:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// @route GET /api/messages/:id
// @desc Obtenir un message par ID
// @access Private (Admin ou Propriétaire du prestataire)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const message = await prisma.message.findUnique({
      where: { id },
      include: {
        prestataire: {
          select: {
            id: true,
            nom: true,
            ville: true,
            userId: true,
            category: {
              select: { nom: true }
            }
          }
        }
      }
    });

    if (!message) {
      return res.status(404).json({ error: 'Message non trouvé' });
    }

    // Vérifier les permissions
    if (req.user.role !== 'ADMIN' && message.prestataire.userId !== req.user.id) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    res.json({ message });
  } catch (error) {
    console.error('Erreur récupération message:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// @route PUT /api/messages/:id/marquer-lu
// @desc Marquer un message comme lu
// @access Private (Admin ou Propriétaire du prestataire)
router.put('/:id/marquer-lu', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const message = await prisma.message.findUnique({
      where: { id },
      include: {
        prestataire: {
          select: { userId: true }
        }
      }
    });

    if (!message) {
      return res.status(404).json({ error: 'Message non trouvé' });
    }

    // Vérifier les permissions
    if (req.user.role !== 'ADMIN' && message.prestataire.userId !== req.user.id) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const updatedMessage = await prisma.message.update({
      where: { id },
      data: { lu: true }
    });

    res.json({
      message: 'Message marqué comme lu',
      data: updatedMessage
    });
  } catch (error) {
    console.error('Erreur marquage message lu:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// @route PUT /api/messages/:id/marquer-non-lu
// @desc Marquer un message comme non lu
// @access Private (Admin ou Propriétaire du prestataire)
router.put('/:id/marquer-non-lu', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const message = await prisma.message.findUnique({
      where: { id },
      include: {
        prestataire: {
          select: { userId: true }
        }
      }
    });

    if (!message) {
      return res.status(404).json({ error: 'Message non trouvé' });
    }

    // Vérifier les permissions
    if (req.user.role !== 'ADMIN' && message.prestataire.userId !== req.user.id) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const updatedMessage = await prisma.message.update({
      where: { id },
      data: { lu: false }
    });

    res.json({
      message: 'Message marqué comme non lu',
      data: updatedMessage
    });
  } catch (error) {
    console.error('Erreur marquage message non lu:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// @route DELETE /api/messages/:id
// @desc Supprimer un message
// @access Private (Admin ou Propriétaire du prestataire)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const message = await prisma.message.findUnique({
      where: { id },
      include: {
        prestataire: {
          select: { userId: true }
        }
      }
    });

    if (!message) {
      return res.status(404).json({ error: 'Message non trouvé' });
    }

    // Vérifier les permissions
    if (req.user.role !== 'ADMIN' && message.prestataire.userId !== req.user.id) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    await prisma.message.delete({
      where: { id }
    });

    res.json({ message: 'Message supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression message:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// @route GET /api/messages/stats/dashboard
// @desc Obtenir les statistiques des messages pour le dashboard
// @access Private (Admin ou Prestataire)
router.get('/stats/dashboard', authenticateToken, async (req, res) => {
  try {
    let statsQuery = {};

    // Si c'est un prestataire, filtrer par ses prestataires
    if (req.user.role === 'PRESTATAIRE') {
      const userPrestataire = await prisma.prestataire.findUnique({
        where: { userId: req.user.id },
        select: { id: true }
      });

      if (!userPrestataire) {
        return res.status(404).json({ error: 'Profil prestataire non trouvé' });
      }

      statsQuery.prestataireId = userPrestataire.id;
    }

    const [
      totalMessages,
      messagesNonLus,
      messagesToday,
      messagesThisWeek
    ] = await Promise.all([
      prisma.message.count({ where: statsQuery }),
      prisma.message.count({ where: { ...statsQuery, lu: false } }),
      prisma.message.count({
        where: {
          ...statsQuery,
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      prisma.message.count({
        where: {
          ...statsQuery,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    res.json({
      stats: {
        total: totalMessages,
        nonLus: messagesNonLus,
        aujourdhui: messagesToday,
        cetteSemaine: messagesThisWeek
      }
    });
  } catch (error) {
    console.error('Erreur récupération stats messages:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;
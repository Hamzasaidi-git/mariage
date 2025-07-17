// Routes pour la gestion des avis
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Fonction utilitaire pour recalculer la note moyenne d'un prestataire
const updatePrestataireRating = async (prestataireId) => {
  const avisStats = await prisma.avis.aggregate({
    where: { prestataireId },
    _avg: { note: true },
    _count: { note: true }
  });

  await prisma.prestataire.update({
    where: { id: prestataireId },
    data: {
      note: avisStats._avg.note || 0,
      nombre_avis: avisStats._count.note || 0
    }
  });
};

// @route POST /api/avis
// @desc Ajouter un avis pour un prestataire
// @access Public
router.post('/', async (req, res) => {
  try {
    const {
      prestataireId,
      note,
      commentaire,
      nom_client
    } = req.body;

    // Validation des champs requis
    if (!prestataireId || !note || !nom_client) {
      return res.status(400).json({ 
        error: 'Prestataire, note et nom du client sont requis' 
      });
    }

    // Validation de la note (1-5)
    if (note < 1 || note > 5 || !Number.isInteger(note)) {
      return res.status(400).json({ 
        error: 'La note doit être un entier entre 1 et 5' 
      });
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

    // Créer l'avis
    const newAvis = await prisma.avis.create({
      data: {
        prestataireId,
        note,
        commentaire: commentaire?.trim() || null,
        nom_client: nom_client.trim(),
        // Si l'utilisateur est connecté, l'associer
        ...(req.user && { userId: req.user.id })
      },
      include: {
        prestataire: {
          select: { nom: true }
        }
      }
    });

    // Recalculer la note moyenne du prestataire
    await updatePrestataireRating(prestataireId);

    res.status(201).json({
      message: 'Avis ajouté avec succès',
      avis: newAvis
    });
  } catch (error) {
    console.error('Erreur ajout avis:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// @route GET /api/avis/prestataire/:prestataireId
// @desc Obtenir les avis d'un prestataire
// @access Public
router.get('/prestataire/:prestataireId', async (req, res) => {
  try {
    const { prestataireId } = req.params;
    const { page = 1, limit = 10, sort = 'recent' } = req.query;
    
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Définir l'ordre de tri
    let orderBy = { createdAt: 'desc' }; // Par défaut: plus récents
    
    switch (sort) {
      case 'rating_desc':
        orderBy = { note: 'desc' };
        break;
      case 'rating_asc':
        orderBy = { note: 'asc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
    }

    // Vérifier que le prestataire existe
    const prestataire = await prisma.prestataire.findUnique({
      where: { id: prestataireId },
      select: { id: true, nom: true, note: true, nombre_avis: true }
    });

    if (!prestataire) {
      return res.status(404).json({ error: 'Prestataire non trouvé' });
    }

    const [avis, total, ratingBreakdown] = await Promise.all([
      prisma.avis.findMany({
        where: { prestataireId },
        select: {
          id: true,
          note: true,
          commentaire: true,
          nom_client: true,
          createdAt: true
        },
        orderBy,
        skip: offset,
        take: parseInt(limit)
      }),
      prisma.avis.count({ where: { prestataireId } }),
      // Répartition des notes
      prisma.avis.groupBy({
        by: ['note'],
        where: { prestataireId },
        _count: { note: true }
      })
    ]);

    // Formater la répartition des notes
    const breakdown = {};
    for (let i = 1; i <= 5; i++) {
      const found = ratingBreakdown.find(r => r.note === i);
      breakdown[i] = found ? found._count.note : 0;
    }

    res.json({
      prestataire: {
        id: prestataire.id,
        nom: prestataire.nom,
        note: prestataire.note,
        nombre_avis: prestataire.nombre_avis
      },
      avis,
      ratingBreakdown: breakdown,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erreur récupération avis prestataire:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// @route GET /api/avis/admin
// @desc Obtenir tous les avis (admin seulement)
// @access Private (Admin)
router.get('/admin', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50, search, note, prestataireId } = req.query;
    
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      ...(search && {
        OR: [
          { nom_client: { contains: search, mode: 'insensitive' } },
          { commentaire: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(note && { note: parseInt(note) }),
      ...(prestataireId && { prestataireId })
    };

    const [avis, total] = await Promise.all([
      prisma.avis.findMany({
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
      prisma.avis.count({ where })
    ]);

    res.json({
      avis,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erreur récupération avis admin:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// @route GET /api/avis/:id
// @desc Obtenir un avis par ID
// @access Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const avis = await prisma.avis.findUnique({
      where: { id },
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
      }
    });

    if (!avis) {
      return res.status(404).json({ error: 'Avis non trouvé' });
    }

    res.json({ avis });
  } catch (error) {
    console.error('Erreur récupération avis:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// @route PUT /api/avis/:id
// @desc Mettre à jour un avis (admin seulement)
// @access Private (Admin)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { note, commentaire, nom_client } = req.body;

    const existingAvis = await prisma.avis.findUnique({
      where: { id },
      select: { prestataireId: true }
    });

    if (!existingAvis) {
      return res.status(404).json({ error: 'Avis non trouvé' });
    }

    // Validation de la note si elle est modifiée
    if (note && (note < 1 || note > 5 || !Number.isInteger(note))) {
      return res.status(400).json({ 
        error: 'La note doit être un entier entre 1 et 5' 
      });
    }

    const updatedAvis = await prisma.avis.update({
      where: { id },
      data: {
        ...(note && { note }),
        ...(commentaire !== undefined && { commentaire: commentaire?.trim() || null }),
        ...(nom_client && { nom_client: nom_client.trim() })
      },
      include: {
        prestataire: {
          select: { nom: true }
        }
      }
    });

    // Recalculer la note moyenne si la note a changé
    if (note) {
      await updatePrestataireRating(existingAvis.prestataireId);
    }

    res.json({
      message: 'Avis mis à jour avec succès',
      avis: updatedAvis
    });
  } catch (error) {
    console.error('Erreur mise à jour avis:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// @route DELETE /api/avis/:id
// @desc Supprimer un avis (admin seulement)
// @access Private (Admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const avis = await prisma.avis.findUnique({
      where: { id },
      select: { prestataireId: true }
    });

    if (!avis) {
      return res.status(404).json({ error: 'Avis non trouvé' });
    }

    await prisma.avis.delete({
      where: { id }
    });

    // Recalculer la note moyenne du prestataire
    await updatePrestataireRating(avis.prestataireId);

    res.json({ message: 'Avis supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression avis:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// @route GET /api/avis/stats/global
// @desc Obtenir les statistiques globales des avis
// @access Public
router.get('/stats/global', async (req, res) => {
  try {
    const [
      totalAvis,
      averageRating,
      ratingDistribution,
      recentAvis
    ] = await Promise.all([
      prisma.avis.count(),
      prisma.avis.aggregate({
        _avg: { note: true }
      }),
      prisma.avis.groupBy({
        by: ['note'],
        _count: { note: true }
      }),
      prisma.avis.findMany({
        select: {
          id: true,
          note: true,
          nom_client: true,
          commentaire: true,
          createdAt: true,
          prestataire: {
            select: { nom: true, ville: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ]);

    // Formater la distribution des notes
    const distribution = {};
    for (let i = 1; i <= 5; i++) {
      const found = ratingDistribution.find(r => r.note === i);
      distribution[i] = found ? found._count.note : 0;
    }

    res.json({
      stats: {
        total: totalAvis,
        noteMoyenne: averageRating._avg.note || 0,
        distribution,
        aviRecents: recentAvis
      }
    });
  } catch (error) {
    console.error('Erreur récupération stats avis:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// @route GET /api/avis/prestataire/:prestataireId/stats
// @desc Obtenir les statistiques détaillées d'un prestataire
// @access Public
router.get('/prestataire/:prestataireId/stats', async (req, res) => {
  try {
    const { prestataireId } = req.params;

    const [
      prestataire,
      ratingBreakdown,
      recentAvis,
      monthlyStats
    ] = await Promise.all([
      prisma.prestataire.findUnique({
        where: { id: prestataireId },
        select: { id: true, nom: true, note: true, nombre_avis: true }
      }),
      prisma.avis.groupBy({
        by: ['note'],
        where: { prestataireId },
        _count: { note: true }
      }),
      prisma.avis.findMany({
        where: { prestataireId },
        select: {
          note: true,
          commentaire: true,
          nom_client: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        take: 3
      }),
      // Avis par mois sur les 6 derniers mois
      prisma.avis.groupBy({
        by: ['createdAt'],
        where: {
          prestataireId,
          createdAt: {
            gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000)
          }
        },
        _count: { id: true }
      })
    ]);

    if (!prestataire) {
      return res.status(404).json({ error: 'Prestataire non trouvé' });
    }

    // Formater la répartition des notes
    const breakdown = {};
    for (let i = 1; i <= 5; i++) {
      const found = ratingBreakdown.find(r => r.note === i);
      breakdown[i] = found ? found._count.note : 0;
    }

    res.json({
      prestataire,
      ratingBreakdown: breakdown,
      recentAvis,
      tendance: monthlyStats.length > 0 ? 'positive' : 'stable'
    });
  } catch (error) {
    console.error('Erreur récupération stats prestataire:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;
// Routes pour la gestion des prestataires
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireAdmin, requirePrestataireOrAdmin, requireOwnershipOrAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// @route GET /api/prestataires
// @desc Obtenir tous les prestataires avec filtres et pagination
// @access Public
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      search,
      ville,
      category,
      prix_min,
      prix_max,
      sort = 'recent'
    } = req.query;
    
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Construire les filtres
    const where = {
      actif: true,
      ...(search && {
        OR: [
          { nom: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { ville: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(ville && { ville: { contains: ville, mode: 'insensitive' } }),
      ...(category && { category: { nom: { equals: category, mode: 'insensitive' } } }),
      ...(prix_min && { prix_moyen: { gte: parseFloat(prix_min) } }),
      ...(prix_max && { prix_moyen: { lte: parseFloat(prix_max) } })
    };

    // Définir l'ordre de tri
    let orderBy = { createdAt: 'desc' }; // Par défaut: plus récents
    
    switch (sort) {
      case 'price_asc':
        orderBy = { prix_moyen: 'asc' };
        break;
      case 'price_desc':
        orderBy = { prix_moyen: 'desc' };
        break;
      case 'rating':
        orderBy = { note: 'desc' };
        break;
      case 'name':
        orderBy = { nom: 'asc' };
        break;
    }

    const [prestataires, total] = await Promise.all([
      prisma.prestataire.findMany({
        where,
        select: {
          id: true,
          nom: true,
          description: true,
          ville: true,
          prix_moyen: true,
          note: true,
          nombre_avis: true,
          images: true,
          tel: true,
          whatsapp: true,
          instagram: true,
          featured: true,
          createdAt: true,
          category: {
            select: { nom: true, icon: true }
          }
        },
        orderBy: [
          { featured: 'desc' }, // Prestataires en vedette d'abord
          orderBy
        ],
        skip: offset,
        take: parseInt(limit)
      }),
      prisma.prestataire.count({ where })
    ]);

    res.json({
      prestataires,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erreur récupération prestataires:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// @route GET /api/prestataires/featured
// @desc Obtenir les prestataires en vedette
// @access Public
router.get('/featured', async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const prestataires = await prisma.prestataire.findMany({
      where: {
        actif: true,
        featured: true
      },
      select: {
        id: true,
        nom: true,
        description: true,
        ville: true,
        prix_moyen: true,
        note: true,
        nombre_avis: true,
        images: true,
        category: {
          select: { nom: true, icon: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit)
    });

    res.json({ prestataires });
  } catch (error) {
    console.error('Erreur récupération prestataires en vedette:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// @route GET /api/prestataires/villes
// @desc Obtenir la liste des villes disponibles
// @access Public
router.get('/villes', async (req, res) => {
  try {
    const villes = await prisma.prestataire.findMany({
      where: { actif: true },
      select: { ville: true },
      distinct: ['ville'],
      orderBy: { ville: 'asc' }
    });

    const villesList = villes.map(v => v.ville).filter(Boolean);

    res.json({ villes: villesList });
  } catch (error) {
    console.error('Erreur récupération villes:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// @route GET /api/prestataires/:id
// @desc Obtenir un prestataire par ID
// @access Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const prestataire = await prisma.prestataire.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, nom: true, icon: true }
        },
        avis: {
          select: {
            id: true,
            note: true,
            commentaire: true,
            nom_client: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: { 
            messages: true,
            avis: true 
          }
        }
      }
    });

    if (!prestataire) {
      return res.status(404).json({ error: 'Prestataire non trouvé' });
    }

    if (!prestataire.actif) {
      return res.status(404).json({ error: 'Prestataire non disponible' });
    }

    res.json({ prestataire });
  } catch (error) {
    console.error('Erreur récupération prestataire:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// @route POST /api/prestataires
// @desc Créer un nouveau prestataire
// @access Private (Admin ou Prestataire)
router.post('/', authenticateToken, requirePrestataireOrAdmin, async (req, res) => {
  try {
    const {
      nom,
      description,
      adresse,
      ville,
      tel,
      whatsapp,
      instagram,
      email,
      site_web,
      prix_moyen,
      categoryId,
      services,
      horaires,
      images
    } = req.body;

    // Validation des champs requis
    if (!nom || !description || !ville || !categoryId) {
      return res.status(400).json({ 
        error: 'Nom, description, ville et catégorie sont requis' 
      });
    }

    // Vérifier que la catégorie existe
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return res.status(400).json({ error: 'Catégorie invalide' });
    }

    // Si c'est un prestataire, vérifier qu'il n'a pas déjà un profil
    if (req.user.role === 'PRESTATAIRE') {
      const existingPrestataire = await prisma.prestataire.findUnique({
        where: { userId: req.user.id }
      });

      if (existingPrestataire) {
        return res.status(400).json({ error: 'Vous avez déjà un profil prestataire' });
      }
    }

    const prestataireData = {
      nom: nom.trim(),
      description: description.trim(),
      ville: ville.trim(),
      categoryId,
      ...(adresse && { adresse: adresse.trim() }),
      ...(tel && { tel: tel.trim() }),
      ...(whatsapp && { whatsapp: whatsapp.trim() }),
      ...(instagram && { instagram: instagram.trim() }),
      ...(email && { email: email.trim() }),
      ...(site_web && { site_web: site_web.trim() }),
      ...(prix_moyen && { prix_moyen: parseFloat(prix_moyen) }),
      ...(services && { services }),
      ...(horaires && { horaires }),
      ...(images && { images }),
      // Lier au user si c'est un prestataire
      ...(req.user.role === 'PRESTATAIRE' && { userId: req.user.id })
    };

    const prestataire = await prisma.prestataire.create({
      data: prestataireData,
      include: {
        category: {
          select: { nom: true }
        }
      }
    });

    res.status(201).json({
      message: 'Prestataire créé avec succès',
      prestataire
    });
  } catch (error) {
    console.error('Erreur création prestataire:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// @route PUT /api/prestataires/:id
// @desc Mettre à jour un prestataire
// @access Private (Admin ou Propriétaire)
router.put('/:id', authenticateToken, requireOwnershipOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nom,
      description,
      adresse,
      ville,
      tel,
      whatsapp,
      instagram,
      email,
      site_web,
      prix_moyen,
      categoryId,
      services,
      horaires,
      images,
      actif,
      featured
    } = req.body;

    // Vérifier que le prestataire existe
    const existingPrestataire = await prisma.prestataire.findUnique({
      where: { id }
    });

    if (!existingPrestataire) {
      return res.status(404).json({ error: 'Prestataire non trouvé' });
    }

    // Vérifier la catégorie si elle change
    if (categoryId && categoryId !== existingPrestataire.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId }
      });

      if (!category) {
        return res.status(400).json({ error: 'Catégorie invalide' });
      }
    }

    const updateData = {
      ...(nom && { nom: nom.trim() }),
      ...(description && { description: description.trim() }),
      ...(ville && { ville: ville.trim() }),
      ...(categoryId && { categoryId }),
      ...(adresse !== undefined && { adresse: adresse?.trim() || null }),
      ...(tel !== undefined && { tel: tel?.trim() || null }),
      ...(whatsapp !== undefined && { whatsapp: whatsapp?.trim() || null }),
      ...(instagram !== undefined && { instagram: instagram?.trim() || null }),
      ...(email !== undefined && { email: email?.trim() || null }),
      ...(site_web !== undefined && { site_web: site_web?.trim() || null }),
      ...(prix_moyen !== undefined && { prix_moyen: prix_moyen ? parseFloat(prix_moyen) : null }),
      ...(services !== undefined && { services }),
      ...(horaires !== undefined && { horaires }),
      ...(images !== undefined && { images })
    };

    // Seul l'admin peut modifier actif et featured
    if (req.user.role === 'ADMIN') {
      if (actif !== undefined) updateData.actif = actif;
      if (featured !== undefined) updateData.featured = featured;
    }

    const prestataire = await prisma.prestataire.update({
      where: { id },
      data: updateData,
      include: {
        category: {
          select: { nom: true }
        }
      }
    });

    res.json({
      message: 'Prestataire mis à jour avec succès',
      prestataire
    });
  } catch (error) {
    console.error('Erreur mise à jour prestataire:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// @route DELETE /api/prestataires/:id
// @desc Supprimer un prestataire
// @access Private (Admin ou Propriétaire)
router.delete('/:id', authenticateToken, requireOwnershipOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const prestataire = await prisma.prestataire.findUnique({
      where: { id }
    });

    if (!prestataire) {
      return res.status(404).json({ error: 'Prestataire non trouvé' });
    }

    await prisma.prestataire.delete({
      where: { id }
    });

    res.json({ message: 'Prestataire supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression prestataire:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// @route GET /api/prestataires/:id/similaires
// @desc Obtenir des prestataires similaires
// @access Public
router.get('/:id/similaires', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 4 } = req.query;

    // Obtenir le prestataire actuel
    const prestataire = await prisma.prestataire.findUnique({
      where: { id },
      select: { categoryId: true, ville: true }
    });

    if (!prestataire) {
      return res.status(404).json({ error: 'Prestataire non trouvé' });
    }

    // Rechercher des prestataires similaires
    const similaires = await prisma.prestataire.findMany({
      where: {
        id: { not: id },
        actif: true,
        OR: [
          { categoryId: prestataire.categoryId },
          { ville: prestataire.ville }
        ]
      },
      select: {
        id: true,
        nom: true,
        description: true,
        ville: true,
        prix_moyen: true,
        note: true,
        nombre_avis: true,
        images: true,
        category: {
          select: { nom: true }
        }
      },
      orderBy: { note: 'desc' },
      take: parseInt(limit)
    });

    res.json({ similaires });
  } catch (error) {
    console.error('Erreur récupération prestataires similaires:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// @route GET /api/prestataires/admin/all
// @desc Obtenir tous les prestataires pour l'admin
// @access Private (Admin)
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, actif, featured, category } = req.query;
    
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      ...(search && {
        OR: [
          { nom: { contains: search, mode: 'insensitive' } },
          { ville: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(actif !== undefined && { actif: actif === 'true' }),
      ...(featured !== undefined && { featured: featured === 'true' }),
      ...(category && { category: { nom: category } })
    };

    const [prestataires, total] = await Promise.all([
      prisma.prestataire.findMany({
        where,
        include: {
          category: {
            select: { nom: true }
          },
          user: {
            select: { nom: true, email: true }
          },
          _count: {
            select: { messages: true, avis: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: parseInt(limit)
      }),
      prisma.prestataire.count({ where })
    ]);

    res.json({
      prestataires,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erreur récupération prestataires admin:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;
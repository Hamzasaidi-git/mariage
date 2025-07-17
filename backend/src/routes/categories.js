// Routes pour la gestion des catégories
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// @route GET /api/categories
// @desc Obtenir toutes les catégories
// @access Public
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        nom: true,
        description: true,
        icon: true,
        _count: {
          select: {
            prestataires: {
              where: { actif: true }
            }
          }
        }
      },
      orderBy: { nom: 'asc' }
    });

    // Reformater pour inclure le nombre de prestataires
    const categoriesWithCount = categories.map(category => ({
      ...category,
      nombrePrestataires: category._count.prestataires,
      _count: undefined
    }));

    res.json({ categories: categoriesWithCount });
  } catch (error) {
    console.error('Erreur récupération catégories:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// @route GET /api/categories/:id
// @desc Obtenir une catégorie par ID
// @access Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            prestataires: {
              where: { actif: true }
            }
          }
        }
      }
    });

    if (!category) {
      return res.status(404).json({ error: 'Catégorie non trouvée' });
    }

    const categoryWithCount = {
      ...category,
      nombrePrestataires: category._count.prestataires,
      _count: undefined
    };

    res.json({ category: categoryWithCount });
  } catch (error) {
    console.error('Erreur récupération catégorie:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// @route POST /api/categories
// @desc Créer une nouvelle catégorie
// @access Private (Admin)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { nom, description, icon } = req.body;

    // Validation
    if (!nom) {
      return res.status(400).json({ error: 'Le nom de la catégorie est requis' });
    }

    // Vérifier si la catégorie existe déjà
    const existingCategory = await prisma.category.findUnique({
      where: { nom: nom.trim() }
    });

    if (existingCategory) {
      return res.status(400).json({ error: 'Cette catégorie existe déjà' });
    }

    const category = await prisma.category.create({
      data: {
        nom: nom.trim(),
        description: description?.trim(),
        icon: icon?.trim()
      }
    });

    res.status(201).json({
      message: 'Catégorie créée avec succès',
      category
    });
  } catch (error) {
    console.error('Erreur création catégorie:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// @route PUT /api/categories/:id
// @desc Mettre à jour une catégorie
// @access Private (Admin)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, description, icon } = req.body;

    // Vérifier si la catégorie existe
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return res.status(404).json({ error: 'Catégorie non trouvée' });
    }

    // Si le nom change, vérifier qu'il n'existe pas déjà
    if (nom && nom.trim() !== existingCategory.nom) {
      const duplicateCategory = await prisma.category.findUnique({
        where: { nom: nom.trim() }
      });

      if (duplicateCategory) {
        return res.status(400).json({ error: 'Cette catégorie existe déjà' });
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(nom && { nom: nom.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(icon !== undefined && { icon: icon?.trim() || null })
      }
    });

    res.json({
      message: 'Catégorie mise à jour avec succès',
      category
    });
  } catch (error) {
    console.error('Erreur mise à jour catégorie:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// @route DELETE /api/categories/:id
// @desc Supprimer une catégorie
// @access Private (Admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si la catégorie existe
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { prestataires: true }
        }
      }
    });

    if (!category) {
      return res.status(404).json({ error: 'Catégorie non trouvée' });
    }

    // Vérifier s'il y a des prestataires dans cette catégorie
    if (category._count.prestataires > 0) {
      return res.status(400).json({ 
        error: 'Impossible de supprimer une catégorie qui contient des prestataires' 
      });
    }

    await prisma.category.delete({
      where: { id }
    });

    res.json({ message: 'Catégorie supprimée avec succès' });
  } catch (error) {
    console.error('Erreur suppression catégorie:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// @route GET /api/categories/:nom/prestataires
// @desc Obtenir les prestataires d'une catégorie par nom
// @access Public
router.get('/:nom/prestataires', async (req, res) => {
  try {
    const { nom } = req.params;
    const { page = 1, limit = 12, ville, prix_min, prix_max, sort = 'recent' } = req.query;
    
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Trouver la catégorie
    const category = await prisma.category.findUnique({
      where: { nom: decodeURIComponent(nom) }
    });

    if (!category) {
      return res.status(404).json({ error: 'Catégorie non trouvée' });
    }

    // Construire les filtres
    const where = {
      categoryId: category.id,
      actif: true,
      ...(ville && { ville: { contains: ville, mode: 'insensitive' } }),
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
          category: {
            select: { nom: true }
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
      category,
      prestataires,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erreur récupération prestataires par catégorie:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;
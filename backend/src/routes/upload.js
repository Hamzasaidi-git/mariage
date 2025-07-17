// Routes pour l'upload d'images
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { authenticateToken, requirePrestataireOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Configuration de stockage local avec multer
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads');
    try {
      await fs.access(uploadPath);
    } catch (error) {
      await fs.mkdir(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Générer un nom unique pour le fichier
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Configuration des filtres de fichiers
const fileFilter = (req, file, cb) => {
  // Types de fichiers autorisés
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Seules les images (JPEG, JPG, PNG, GIF, WebP) sont autorisées'));
  }
};

// Configuration multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max par fichier
    files: 10 // Maximum 10 fichiers par upload
  },
  fileFilter: fileFilter
});

// @route POST /api/upload/single
// @desc Upload d'une seule image
// @access Private (Prestataire ou Admin)
router.post('/single', authenticateToken, requirePrestataireOrAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucune image fournie' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      message: 'Image uploadée avec succès',
      url: imageUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('Erreur upload image:', error);
    res.status(500).json({ error: 'Erreur lors de l\'upload de l\'image' });
  }
});

// @route POST /api/upload/multiple
// @desc Upload de plusieurs images
// @access Private (Prestataire ou Admin)
router.post('/multiple', authenticateToken, requirePrestataireOrAdmin, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Aucune image fournie' });
    }

    const uploadedFiles = req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size
    }));
    
    res.json({
      message: `${req.files.length} image(s) uploadée(s) avec succès`,
      files: uploadedFiles,
      count: req.files.length
    });
  } catch (error) {
    console.error('Erreur upload images:', error);
    res.status(500).json({ error: 'Erreur lors de l\'upload des images' });
  }
});

// @route DELETE /api/upload/:filename
// @desc Supprimer une image
// @access Private (Prestataire ou Admin)
router.delete('/:filename', authenticateToken, requirePrestataireOrAdmin, async (req, res) => {
  try {
    const { filename } = req.params;
    
    // Validation du nom de fichier
    if (!filename || filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({ error: 'Nom de fichier invalide' });
    }

    const filePath = path.join(__dirname, '../../uploads', filename);
    
    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
      
      res.json({ message: 'Image supprimée avec succès' });
    } catch (error) {
      if (error.code === 'ENOENT') {
        return res.status(404).json({ error: 'Image non trouvée' });
      }
      throw error;
    }
  } catch (error) {
    console.error('Erreur suppression image:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'image' });
  }
});

// @route GET /api/upload/list
// @desc Lister les images uploadées
// @access Private (Admin)
router.get('/list', authenticateToken, async (req, res) => {
  try {
    // Seuls les admins peuvent lister toutes les images
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Accès admin requis' });
    }

    const uploadPath = path.join(__dirname, '../../uploads');
    
    try {
      const files = await fs.readdir(uploadPath);
      const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
      });

      const filesWithStats = await Promise.all(
        imageFiles.map(async (file) => {
          const filePath = path.join(uploadPath, file);
          const stats = await fs.stat(filePath);
          return {
            filename: file,
            url: `/uploads/${file}`,
            size: stats.size,
            createdAt: stats.birthtime,
            modifiedAt: stats.mtime
          };
        })
      );

      // Trier par date de création (plus récent d'abord)
      filesWithStats.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      res.json({
        images: filesWithStats,
        count: filesWithStats.length
      });
    } catch (error) {
      if (error.code === 'ENOENT') {
        return res.json({ images: [], count: 0 });
      }
      throw error;
    }
  } catch (error) {
    console.error('Erreur listage images:', error);
    res.status(500).json({ error: 'Erreur lors du listage des images' });
  }
});

// @route GET /api/upload/info/:filename
// @desc Obtenir les informations d'une image
// @access Private
router.get('/info/:filename', authenticateToken, async (req, res) => {
  try {
    const { filename } = req.params;
    
    // Validation du nom de fichier
    if (!filename || filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({ error: 'Nom de fichier invalide' });
    }

    const filePath = path.join(__dirname, '../../uploads', filename);
    
    try {
      const stats = await fs.stat(filePath);
      
      res.json({
        filename,
        url: `/uploads/${filename}`,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
        isFile: stats.isFile()
      });
    } catch (error) {
      if (error.code === 'ENOENT') {
        return res.status(404).json({ error: 'Image non trouvée' });
      }
      throw error;
    }
  } catch (error) {
    console.error('Erreur info image:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des informations' });
  }
});

// Middleware de gestion des erreurs multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Fichier trop volumineux (max 5MB)' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Trop de fichiers (max 10)' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Champ de fichier inattendu' });
    }
  }
  
  if (error.message.includes('Seules les images')) {
    return res.status(400).json({ error: error.message });
  }
  
  console.error('Erreur upload:', error);
  res.status(500).json({ error: 'Erreur lors de l\'upload' });
});

module.exports = router;
const express = require('express');
const articleController = require('../controllers/articleController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Obtenir tous les articles
router.get('/', authMiddleware.verifyToken, articleController.getArticles);

router.get('/:id',authMiddleware.verifyToken, articleController.getArticlesByIds);

// Créer un article
router.post('/', authMiddleware.verifyToken, authMiddleware.verifyRole('gerant'), articleController.createArticle);

// Mettre à jour un article
router.put('/:id', authMiddleware.verifyToken, authMiddleware.verifyRole('gerant'), articleController.updateArticle);

// Supprimer un article
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.verifyRole('gerant'), articleController.deleteArticle);

module.exports = router;
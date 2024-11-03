const express = require('express');
const decorController = require('../controllers/decorController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Obtenir tous les décors
router.get('/',authMiddleware.verifyToken, decorController.getDecors);

router.get('/:id',authMiddleware.verifyToken, decorController.getDecorById);

//router.get('/decor_articles/decor_id/:id', decorController.getDecor_ArticleById);


// Obtenir les articles associés à un décor
router.get('/:id/articles',authMiddleware.verifyToken, decorController.getDecorArticles);

// Créer un décor
router.post('/',authMiddleware.verifyToken, authMiddleware.verifyRole('gerant'), decorController.createDecor);

// Mettre à jour un décor
router.put('/:id',authMiddleware.verifyToken, authMiddleware.verifyRole('gerant'), decorController.updateDecor);

// Supprimer un décor
router.delete('/:id',authMiddleware.verifyToken, authMiddleware.verifyRole('gerant'), decorController.deleteDecor);

module.exports = router;
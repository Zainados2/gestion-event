const express = require('express');
const articleController = require('../controllers/articleController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware.verifyToken, articleController.getArticles);

router.get('/:id',authMiddleware.verifyToken, articleController.getArticlesByIds);

router.post('/', authMiddleware.verifyToken, authMiddleware.verifyRole('gerant', 'admin'), articleController.createArticle);

router.put('/:id', authMiddleware.verifyToken, authMiddleware.verifyRole('gerant', 'admin'), articleController.updateArticle);

router.delete('/:id', authMiddleware.verifyToken, authMiddleware.verifyRole('gerant', 'admin'), articleController.deleteArticle);

module.exports = router;
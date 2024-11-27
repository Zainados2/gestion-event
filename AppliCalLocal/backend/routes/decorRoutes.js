const express = require('express');
const decorController = require('../controllers/decorController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/',authMiddleware.verifyToken, decorController.getDecors);

router.get('/:id',authMiddleware.verifyToken, decorController.getDecorById);

router.get('/:id/articles',authMiddleware.verifyToken, decorController.getDecorArticles);

router.post('/',authMiddleware.verifyToken, authMiddleware.verifyRole('gerant', 'admin'), decorController.createDecor);

router.put('/:id',authMiddleware.verifyToken, authMiddleware.verifyRole('gerant', 'admin'), decorController.updateDecor);

router.delete('/:id',authMiddleware.verifyToken, authMiddleware.verifyRole('gerant', 'admin'), decorController.deleteDecor);

module.exports = router;
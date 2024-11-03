const express = require('express');
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

//router.post('/events/:id/articles', eventController.addArticlesToEvent);

// Route pour supprimer les articles d'un événement
//router.delete('/events/:id/articles', eventController.removeArticlesFromEvent);

//router.get('/decors', eventController.getDecors);
//router.get('/articles', eventController.getArticles);
//router.get('/addresses', eventController.getAddressesForEvent);

// Créer un événement
router.post('/',authMiddleware.verifyToken, authMiddleware.verifyRole('gerant'), eventController.createEvent);

// Lire tous les événements
router.get('/',authMiddleware.verifyToken, eventController.getEvents);

// Mettre à jour un événement
router.put('/:id',authMiddleware.verifyToken, authMiddleware.verifyRole('gerant'), eventController.updateEvent);

// Supprimer un événement
router.delete('/:id',authMiddleware.verifyToken, authMiddleware.verifyRole('gerant'), eventController.deleteEvent);

module.exports = router;
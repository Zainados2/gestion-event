const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Inscription d'un nouvel utilisateur
router.post('/users',authMiddleware.verifyToken, authMiddleware.verifyRole('gerant'), userController.registerUser);

// Connexion d'un utilisateur existant
router.post('/', userController.loginUser);

// Obtenir tous les utilisateurs
router.get('/users', authMiddleware.verifyToken, userController.getUsers);

// Supprimer un utilisateur
router.delete('/users/:id', authMiddleware.verifyToken, authMiddleware.verifyRole('gerant'), userController.deleteUser);

// Obtenir l'utilisateur actuel
router.get('/me', authMiddleware.verifyToken, userController.getCurrentUser);

router.get('/users/:id', authMiddleware.verifyToken, userController.getUserById)

// Route protégée (exemple)
router.get('/admin', authMiddleware.verifyToken, authMiddleware.verifyRole('gerant'), (req, res) => {
  res.status(200).json({ success: true, message: 'Bienvenue, gerant!' });
});

module.exports = router;
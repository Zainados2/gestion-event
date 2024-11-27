const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/users',authMiddleware.verifyToken, authMiddleware.verifyRole('gerant'), userController.registerUser);

router.post('/', userController.loginUser);

router.get('/users', authMiddleware.verifyToken, userController.getUsers);

router.delete('/users/:id', authMiddleware.verifyToken, authMiddleware.verifyRole('gerant'), userController.deleteUser);

router.get('/me', authMiddleware.verifyToken, userController.getCurrentUser);

router.get('/users/:id', authMiddleware.verifyToken, userController.getUserById)

router.get('/admin', authMiddleware.verifyToken, authMiddleware.verifyRole('gerant'), (req, res) => {
  res.status(200).json({ success: true, message: 'Bienvenue, gerant!' });
});

module.exports = router;
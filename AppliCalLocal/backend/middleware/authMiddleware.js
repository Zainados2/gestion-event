const jwt = require('jsonwebtoken');
const User = require('../models/modelsUser'); // Assure-toi que ce chemin est correct

const jwtSecret = 'YOUR_JWT_SECRET'; // Remplacez par votre secret JWT réel

// Middleware pour vérifier le token JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(403).json({ success: false, message: 'Pas de token fourni.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).json({ success: false, message: 'Format du token invalide.' });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Échec de l\'authentification du token.' });
    }
    req.userId = decoded.userId; // Ajoute l'ID utilisateur au request pour une utilisation ultérieure
    next();
  });
};

// Middleware pour vérifier le rôle de l'utilisateur
const verifyRole = (role) => {
  return async (req, res, next) => {
    try {
      const user = await User.findByPk(req.userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
      }
      if (user.role !== role) {
        return res.status(403).json({ success: false, message: 'Accès refusé.' });
      }
      next();
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
  };
};

module.exports = {
  verifyToken,
  verifyRole,
};

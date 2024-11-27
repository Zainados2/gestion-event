const jwt = require('jsonwebtoken');
const User = require('../models/modelsUser'); 

const jwtSecret = 'YOUR_JWT_SECRET'; 


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
    req.userId = decoded.userId; 
    next();
  });
};


const verifyRole = (...roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findByPk(req.userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
      }
      if (!roles.includes(user.role)) {
        return res.status(403).json({ success: false, message: 'Accès refusé.' });
      }
      next();
    } catch (error) {
      console.error('Erreur dans le middleware verifyRole:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
  };
};

module.exports = {
  verifyToken,
  verifyRole,
};

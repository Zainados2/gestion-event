const { Op } = require('sequelize');
const sequelize = require('../models/db');
const User = require('../models/modelsUser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET; 

const reorderIDs = async (deletedId) => {
  try {
    await User.update(
      { id: sequelize.literal('id - 1') },
      { where: { id: { [Op.gt]: deletedId } } }
    );
  } catch (error) {
    console.error('Erreur lors de la réorganisation des IDs:', error);
    throw error;
  }
};

const registerUser = async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({
      success: false,
      message: 'Tous les champs (nom d\'utilisateur, mot de passe, rôle) sont requis.',
      errors: {
        username: !username ? "Nom d'utilisateur est requis." : '',
        password: !password ? 'Mot de passe est requis.' : '',
        role: !role ? 'Rôle est requis.' : '',
      },
    });
  }

  try {
    const userExists = await User.findOne({ where: { username } });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Nom d\'utilisateur déjà utilisé.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ username, password: hashedPassword, role });
    res.status(201).json({ success: true, message: 'Utilisateur enregistré.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log(username, password)
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Nom d\'utilisateur ou mot de passe incorrect.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
      res.status(200).json({ success: true, token });
    } else {
      res.status(401).json({ success: false, message: 'Nom d\'utilisateur ou mot de passe incorrect.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

const getUsers = async (req, res) => {
  try {
    // Vérification du rôle de l'utilisateur qui fait la requête
    const { userRole } = req; // Assurez-vous que `userRole` est défini dans votre middleware ou lors de l'authentification.

    // Si l'utilisateur est un admin, on ramène toutes les informations des utilisateurs
    if (userRole === 'admin') {
      const users = await User.findAll(); // Retourner toutes les colonnes si l'utilisateur est admin
      return res.status(200).json({ success: true, users });
    }

    // Sinon, on exclut les rôles 'gérant' et 'admin'
    const users = await User.findAll({
      attributes: ['id', 'username', 'role'], // Spécifier les attributs à renvoyer
      where: { role: { [Op.notIn]: ['gérant', 'admin'] } },
    });

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    console.log(`Suppression de l'utilisateur avec l'ID: ${id}`);
    await User.destroy({ where: { id } });
    console.log(`Utilisateur avec l'ID ${id} supprimé`);
    await reorderIDs(id);
    console.log(`Réorganisation des IDs après suppression de l'utilisateur ${id}`);
    res.status(200).json({ success: true, message: 'Utilisateur supprimé et IDs réorganisés.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

const getCurrentUser = async (req, res) => {
  const { userId } = req;

  try {
    const user = await User.findByPk(userId, { attributes: ['id', 'username', 'role'] });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, { attributes: ['id', 'username', 'role'] });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, password, role } = req.body; 
  if (!username && !password && !role) {
    return res.status(400).json({
      success: false,
      message: 'Les champs doivent être complété',
    });
  }
  try {
    const user = await User.findByPk(id); 
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }
    if (username) {
      user.username = username;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    if (role) {
      user.role = role;
    }
    await user.save();
    res.status(200).json({ success: true, message: 'Utilisateur mis à jour avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getUsers,
  deleteUser,
  getCurrentUser,
  getUserById,
  updateUser
};

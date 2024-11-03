const { DataTypes } = require('sequelize');
const sequelize = require('./db'); // Assure-toi que ce chemin est correct
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING(191), // Longueur maximale de 191 caractères
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true, // Assure que le champ n'est pas vide
      // Expression régulière ajustée pour inclure des caractères spéciaux
      is: /^[a-zA-Z0-9_.-]*$/,
      len: [3, 30] // Longueur minimale de 3 et maximale de 30 caractères
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      is: /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+$/, 
      len: [6, 100] // Longueur minimale de 8 et maximale de 100 caractères
    }
  },
  role: {
    type: DataTypes.ENUM('gerant', 'photographe', 'decorateur', 'photographeassistant', 'chauffeur', 'decorateurassistant'),
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: false,
});

module.exports = User;

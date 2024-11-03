const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./db'); // Votre instance Sequelize

const Address = sequelize.define('Address', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 50], // Limiter la longueur à 50 caractères
      is: /^[a-zA-Z0-9\s]+$/i // Limiter les caractères autorisés à alphanumériques et espaces
    }
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 100], // Limiter la longueur à 100 caractères
      is: /^[a-zA-Z0-9\s,]+$/i // Limiter les caractères autorisés à alphanumériques, espaces, et virgules
    }
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['studio', 'shooting']], // Limiter les valeurs à 'studio' et 'shooting'
    }},
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
}, {
  tableName: 'addresses',
  timestamps: false,
});

module.exports = Address;

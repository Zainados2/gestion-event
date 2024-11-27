const { DataTypes } = require('sequelize');
const sequelize = require('./db'); 
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING(191), 
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true, 
      is: /^[a-zA-Z0-9_.-]*$/,
      len: [3, 30] 
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      is: /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+$/, 
      len: [6, 100] 
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

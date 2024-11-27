const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./db'); 

const Address = sequelize.define('Address', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 50], 
      is: /^[a-zA-Z0-9\s]+$/i 
    }
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 100], 
      is: /^[a-zA-Z0-9\s,]+$/i 
    }
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['studio', 'shooting']], 
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

const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('./db');

const Decor = sequelize.define('Decor', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  tableName: 'decors', 
  timestamps: false, 
});

module.exports = Decor;

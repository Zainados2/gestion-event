const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./db'); 

const EventAddress = sequelize.define('EventAddress', {
  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true, 
    references: {
      model: 'events', 
      key: 'id',
    },
    onDelete: 'CASCADE', 
  },
  address_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true, 
    references: {
      model: 'addresses', 
      key: 'id',
    },
    onDelete: 'CASCADE', 
  },
}, {
  tableName: 'event_address', 
  timestamps: false, 
});

module.exports = EventAddress;

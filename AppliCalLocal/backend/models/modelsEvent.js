const { DataTypes } = require('sequelize');
const sequelize = require('./db'); 

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  start: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end: {
    type: DataTypes.DATE,
    allowNull: false
  },
  allDay: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  participants: {
    type: DataTypes.STRING, 
    allowNull: false
  },
  location_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  decor_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  address_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  article_ids: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'events',
  timestamps: false
});

module.exports = Event;

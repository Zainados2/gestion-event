const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./db');
const Event = require('./modelsEvent');
const Decor = require('./modelsDecors');

const EventDecor = sequelize.define('EventDecor', {
  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false // Assurez-vous que ce champ ne peut pas être NULL
  },
  decor_id: {
    type: DataTypes.INTEGER,
    allowNull: false // Assurez-vous que ce champ ne peut pas être NULL
  },
  validation_decors: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  montage_decors: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  demontage_decors: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'event_decors',
  timestamps: false
});


Event.belongsToMany(Decor, { through: EventDecor, foreignKey: 'event_id' });
Decor.belongsToMany(Event, { through: EventDecor, foreignKey: 'decor_id' });

module.exports = EventDecor;

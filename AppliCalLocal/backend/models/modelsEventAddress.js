const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./db'); // Assurez-vous que ce chemin est correct

const EventAddress = sequelize.define('EventAddress', {
  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true, // Défini comme partie de la clé primaire composite
    references: {
      model: 'events', // Nom de la table des événements
      key: 'id',
    },
    onDelete: 'CASCADE', // Optionnel : supprime l'enregistrement dans event_address si l'événement est supprimé
  },
  address_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true, // Défini comme partie de la clé primaire composite
    references: {
      model: 'addresses', // Nom de la table des adresses
      key: 'id',
    },
    onDelete: 'CASCADE', // Optionnel : supprime l'enregistrement dans event_address si l'adresse est supprimée
  },
}, {
  tableName: 'event_address', // Nom de la table
  timestamps: false, // Pas de colonnes createdAt/updatedAt
  // Assurez-vous de ne pas inclure d'options qui tenteraient d'ajouter un champ `id`
});

module.exports = EventAddress;

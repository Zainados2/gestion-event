const { Sequelize } = require('sequelize');
require('dotenv').config(); // Charger les variables d'environnement depuis un fichier .env

const sequelize = new Sequelize('Memoire', 'root', 'Dragove12*', {
  host: 'db',
  dialect: 'mysql',
  logging: false, // Désactiver les logs SQL (optionnel)
});

// Test de la connexion à la base de données
sequelize.authenticate()
  .then(() => {
    console.log('Connecté à la base de données MySQL avec Sequelize');
  })
  .catch(err => {
    console.error('Erreur de connexion à la base de données:', err);
  });

module.exports = sequelize;

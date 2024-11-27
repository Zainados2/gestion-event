const { Sequelize } = require('sequelize');
require('dotenv').config(); 

const sequelize = new Sequelize('Memoire', 'root', 'Dragove12*', {
  host: 'db',
  dialect: 'mysql',
  logging: false, 
});


sequelize.authenticate()
  .then(() => {
    console.log('Connecté à la base de données MySQL avec Sequelize');
  })
  .catch(err => {
    console.error('Erreur de connexion à la base de données:', err);
  });

module.exports = sequelize;

// services/validateArticles.js
const Article = require('../models/modelsArticles');

const { Op } = require('sequelize'); // Assurez-vous que vous avez importé Op depuis Sequelize

const validateArticles = async (articleIds) => {
  try {
    const articles = await Article.findAll({
      where: {
        id: {
          [Op.in]: articleIds  // Utilisation de l'opérateur "in" pour vérifier si l'ID de l'article est dans articleIds
        }
      }
    });

    // Vérification si certains articles ont des champs "lost" ou "deteriorated" non nuls
    const problematicArticles = articles.some(article => article.lost !== 0 || article.deteriorated !== 0);

    return problematicArticles;
  } catch (error) {
    console.error('Erreur lors de la validation des articles :', error);
    throw error;
  }
};

module.exports = {
  validateArticles
};

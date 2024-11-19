// services/validateArticles.js
const Article = require('../models/modelsArticles');

const { Op } = require('sequelize'); // Assurez-vous que vous avez importé Op depuis Sequelize

const validateArticles = async (articleIds) => {
  try {
    // Récupérer les articles en fonction de leurs IDs
    const articles = await Article.findAll({
      where: {
        id: {
          [Op.in]: articleIds  // Utilisation de l'opérateur "in" pour vérifier les IDs
        }
      }
    });

    // Ajouter un log pour vérifier les articles récupérés
    console.log('Articles récupérés :', articles);

    // Vérification si certains articles ont des champs "lost" ou "deteriorated" non nuls
    const problematicArticles = articles.some(article => {
      console.log('Article:', article.id, 'Lost:', article.lost, 'Deteriorated:', article.deteriorated);
      return article.lost !== 0 || article.deteriorated !== 0;
    });

    console.log('Articles problématiques:', problematicArticles);

    return problematicArticles;
  } catch (error) {
    console.error('Erreur lors de la validation des articles :', error);
    throw error;
  }
};

module.exports = {
  validateArticles
};

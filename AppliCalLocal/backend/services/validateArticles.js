const Article = require('../models/modelsArticles');

const { Op } = require('sequelize');

const validateArticles = async (articleIds) => {
  try {
    const articles = await Article.findAll({
      where: {
        id: {
          [Op.in]: articleIds 
        }
      }
    });
    const problematicArticles = articles.some(article => Number(article.lost) !== 0 || Number(article.deteriorated) !== 0);
    return problematicArticles;
  } catch (error) {
    console.error('Erreur lors de la validation des articles :', error);
    throw error;
  }
};

module.exports = {
  validateArticles
};

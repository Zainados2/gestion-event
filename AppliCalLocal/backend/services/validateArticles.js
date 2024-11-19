// services/validateArticles.js
const Article = require('../models/modelsArticles');

const validateArticles = async (articleIds) => {
  try {
    const articles = await Article.findAll({
      where: {
        id: articleIds
      }
    });

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

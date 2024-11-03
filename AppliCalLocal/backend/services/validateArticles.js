// services/validateArticles.js
const Article = require('../models/modelsArticles');

const validateArticles = async (articleIds) => {
  try {
    const articles = await Article.findAll({
      where: {
        id: articleIds
      }
    });

    // Ajoutez la logique pour déterminer si certains articles sont problématiques
    const problematicArticles = articles.some(article => article.isProblematic); // Supposons que `isProblematic` est un champ booléen

    return problematicArticles;
  } catch (error) {
    console.error('Erreur lors de la validation des articles :', error);
    throw error;
  }
};

module.exports = {
  validateArticles
};

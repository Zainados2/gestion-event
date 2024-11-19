// services/validateArticles.js
const Article = require('../models/modelsArticles');

const validateArticles = async (articleIds) => {
  try {
    // Récupérer tous les articles de la base de données (pas de filtrage au niveau de la requête SQL)
    const allArticles = await Article.findAll();

    // Filtrer les articles récupérés en fonction des articleIds passés en paramètre
    const filteredArticles = allArticles.filter(article => articleIds.includes(article.id));

    // Vérification des articles problématiques (lost ou deteriorated non nuls)
    const problematicArticles = filteredArticles.some(article => article.lost !== 0 || article.deteriorated !== 0);

    // Retourner si des articles problématiques ont été trouvés
    return problematicArticles;
  } catch (error) {
    console.error('Erreur lors de la validation des articles :', error);
    throw error;
  }
};

module.exports = {
  validateArticles
};

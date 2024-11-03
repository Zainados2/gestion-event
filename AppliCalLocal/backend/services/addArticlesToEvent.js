const EventArticle = require('../models/modelsEventArticle');

const addArticlesToEvent = async (eventId, articleIds) => {
  try {
  
    // Filtrer les ID null ou invalides
    const validArticleIds = articleIds.filter(id => id !== null && id !== undefined);
    
    // Vérifier les duplicatas dans les ID des articles
    const uniqueArticleIds = Array.from(new Set(validArticleIds));
    
    // Préparer les données pour l'insertion
    const entries = uniqueArticleIds.map(articleId => ({
      event_id: eventId,
      article_id: articleId,
      isValidated: false
    }));

    // Insérer les données
    await EventArticle.bulkCreate(entries, {
      updateOnDuplicate: ['isValidated'] // Si vous avez des duplicatas, cette option les met à jour
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout des articles à l\'événement :', error);
    throw error; // Rejeter l'erreur pour qu'elle soit gérée par le contrôleur
  }
};


  module.exports = {
   addArticlesToEvent
  };
const EventArticle = require('../models/modelsEventArticle');

const addArticlesToEvent = async (eventId, articleIds) => {
  try {
  
    const validArticleIds = articleIds.filter(id => id !== null && id !== undefined);
    
    const uniqueArticleIds = Array.from(new Set(validArticleIds));
    
    const entries = uniqueArticleIds.map(articleId => ({
      event_id: eventId,
      article_id: articleId,
      isValidated: false
    }));

    await EventArticle.bulkCreate(entries, {
      updateOnDuplicate: ['isValidated'] 
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout des articles à l\'événement :', error);
    throw error;
  }
};


  module.exports = {
   addArticlesToEvent
  };
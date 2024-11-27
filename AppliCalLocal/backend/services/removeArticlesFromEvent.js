const  EventArticle  = require('../models/modelsEventArticle'); 

const removeArticlesFromEvent = async (eventId) => {
  try {
    await EventArticle.destroy({
      where: { event_id: eventId }
    });
  } catch (error) {
    console.error('Erreur lors de la suppression des articles de l\'événement :', error);
    throw error;
  }
};

module.exports = {
  removeArticlesFromEvent,
}

const  EventArticle  = require('../models/modelsEventArticle'); // Assurez-vous que le chemin vers votre modèle est correct

const removeArticlesFromEvent = async (eventId) => {
  try {
    // Supprime tous les articles associés à l'événement spécifié
    await EventArticle.destroy({
      where: { event_id: eventId }
    });
  } catch (error) {
    console.error('Erreur lors de la suppression des articles de l\'événement :', error);
    throw error; // Rejeter l'erreur pour qu'elle soit gérée par le contrôleur
  }
};

module.exports = {
  removeArticlesFromEvent,
}

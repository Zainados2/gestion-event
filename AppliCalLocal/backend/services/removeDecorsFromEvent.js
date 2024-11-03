const EventDecor = require('../models/modelsEventDecor'); // Assurez-vous que le chemin est correct

const removeDecorsFromEvent = async (eventId) => {
  try {
    // Supprime tous les décors associés à l'événement spécifié
    await EventDecor.destroy({
      where: { event_id: eventId }
    });
  } catch (error) {
    console.error('Erreur lors de la suppression des décors de l\'événement :', error);
    throw error; // Rejeter l'erreur pour qu'elle soit gérée par le contrôleur
  }
};


module.exports = {
    removeDecorsFromEvent
   };
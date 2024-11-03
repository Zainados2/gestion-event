const EventDecor  = require('../models/modelsEventDecor');

const addDecorsToEvent = async (eventId, decorIds) => {
  try {
    // S'assurer que decorIds est un tableau
    const decorIdArray = Array.isArray(decorIds) ? decorIds : [decorIds];

    // Préparer les données pour l'insertion
    const entries = decorIdArray.map(decorId => ({
      event_id: eventId,
      decor_id: decorId
    }));

    // Insérer les données
    await EventDecor.bulkCreate(entries);
  } catch (error) {
    console.error('Erreur lors de l\'ajout du décor à l\'événement :', error);
    throw error; // Rejeter l'erreur pour qu'elle soit gérée par le contrôleur
  }
};



  module.exports = {
  addDecorsToEvent
  };
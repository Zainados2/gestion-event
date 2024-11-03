// services/eventAddressService.js
const EventAddress = require('../models/modelsEventAddress'); // Assurez-vous que le chemin est correct

const removeAddressFromEvent = async (eventId) => {
  try {
    // Supprime toutes les adresses associées à l'événement spécifié
    await EventAddress.destroy({
      where: { event_id: eventId }
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'adresse de l\'événement :', error);
    throw error; // Rejeter l'erreur pour qu'elle soit gérée par le contrôleur
  }
};

module.exports = {
  removeAddressFromEvent,
  // Ajoutez les autres fonctions exportées si nécessaire
};

const Address = require('../models/modelsAdresses');
const Event = require('../models/modelsEvent');
const EventAddress = require('../models/modelsEventAddress');

const addEventAddress = async (eventId, addressId) => {
  try {
    // Préparer les données pour l'insertion
    const entry = {
      event_id: eventId,
      address_id: addressId
    };

    // Insérer les données
    await EventAddress.create(entry);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'adresse à l\'événement :', error);
    throw error; // Rejeter l'erreur pour qu'elle soit gérée par le contrôleur
  }
};

  module.exports = {
   addEventAddress
  };
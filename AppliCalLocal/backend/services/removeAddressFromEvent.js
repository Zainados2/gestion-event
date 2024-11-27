const EventAddress = require('../models/modelsEventAddress'); 

const removeAddressFromEvent = async (eventId) => {
  try {
    await EventAddress.destroy({
      where: { event_id: eventId }
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'adresse de l\'événement :', error);
    throw error; 
  }
};

module.exports = {
  removeAddressFromEvent,
};

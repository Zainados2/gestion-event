const Address = require('../models/modelsAdresses');
const Event = require('../models/modelsEvent');
const EventAddress = require('../models/modelsEventAddress');

const addEventAddress = async (eventId, addressId) => {
  try {
    const entry = {
      event_id: eventId,
      address_id: addressId
    };

    await EventAddress.create(entry);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'adresse à l\'événement :', error);
    throw error; 
  }
};

  module.exports = {
   addEventAddress
  };
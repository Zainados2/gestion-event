const EventDecor  = require('../models/modelsEventDecor');

const addDecorsToEvent = async (eventId, decorIds) => {
  try {
    const decorIdArray = Array.isArray(decorIds) ? decorIds : [decorIds];

    const entries = decorIdArray.map(decorId => ({
      event_id: eventId,
      decor_id: decorId
    }));

    await EventDecor.bulkCreate(entries);
  } catch (error) {
    console.error('Erreur lors de l\'ajout du décor à l\'événement :', error);
    throw error; 
  }
};



  module.exports = {
  addDecorsToEvent
  };
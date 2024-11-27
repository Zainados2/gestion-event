const EventDecor = require('../models/modelsEventDecor'); 

const removeDecorsFromEvent = async (eventId) => {
  try {
    await EventDecor.destroy({
      where: { event_id: eventId }
    });
  } catch (error) {
    console.error('Erreur lors de la suppression des décors de l\'événement :', error);
    throw error; 
  }
};


module.exports = {
    removeDecorsFromEvent
   };
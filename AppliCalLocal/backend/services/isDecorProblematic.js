const Decor = require('../models/modelsDecors');

const isDecorProblematic = async (decorId) => {
    try {
      const decor = await Decor.findByPk(decorId);
      if (!decor) {
        throw new Error('Décor non trouvé.');
      }
      return decor.isProblematic; 
    } catch (error) {
      console.error('Erreur lors de la vérification du décor :', error);
      throw error;
    }
  };

  module.exports = {
   isDecorProblematic
  };
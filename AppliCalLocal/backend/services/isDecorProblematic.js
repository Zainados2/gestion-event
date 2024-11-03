const Decor = require('../models/modelsDecors');

const isDecorProblematic = async (decorId) => {
    try {
      const decor = await Decor.findByPk(decorId);
      if (!decor) {
        throw new Error('Décor non trouvé.');
      }
  
      // Ajoutez la logique pour déterminer si le décor est problématique
      return decor.isProblematic; // Supposons que `isProblematic` est un champ booléen dans votre modèle `Decor`
    } catch (error) {
      console.error('Erreur lors de la vérification du décor :', error);
      throw error;
    }
  };

  module.exports = {
   isDecorProblematic
  };
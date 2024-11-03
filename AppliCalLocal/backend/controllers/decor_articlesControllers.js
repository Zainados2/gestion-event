const DecorArticle = require('../models/modelsDecorArticles'); // Importation du modèle Sequelize

// Obtenir un article associé à un décor par ID
const getDecor_ArticleById = async (req, res) => {
  const { id } = req.params;
  try {
    const decorArticle = await DecorArticle.findAll({
      where: { decor_id: id },
    });
    if (decorArticle.length === 0) {
      return res.status(404).json({ error: 'Decor_article not found' });
    }
    res.json(decorArticle);
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Obtenir tous les articles associés à un décor
const getDecorArticles = async (req, res) => {
  try {
    const decorArticles = await DecorArticle.findAll();
    res.json(decorArticles);
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getDecor_ArticleById,
  getDecorArticles,
};

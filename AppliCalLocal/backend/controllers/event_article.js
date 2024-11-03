const EventArticle = require('../models/modelsEventArticle');
const { Op } = require('sequelize');

const getArticleValidationStatus = async (req, res) => {
  const { eventId, articleId } = req.params;
  const userRole = req.query.role;

  if (userRole !== 'photographe' && userRole !== 'gerant') {
    return res.status(403).send('Accès refusé');
  }

  try {
    const eventArticle = await EventArticle.findOne({
      where: {
        event_id: eventId,
        article_id: articleId,
      },
    });

    if (!eventArticle) {
      return res.status(404).send('Article non trouvé');
    }

    res.json({ isValidated: eventArticle.isValidated });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateArticleValidation = async (req, res) => {
  const { eventId, articleIds } = req.params;
  const userRole = req.query.role;
  const { isValidated } = req.body;
  if (userRole !== 'photographe') {
    return res.status(403).send('Accès refusé');
  }
  try {
    if (typeof isValidated !== 'boolean') {
      return res.status(400).send('Le champ isValidated doit être un booléen.');
    }
    const eventArticle = await EventArticle.findOne({
      where: {
        event_id: eventId,
        article_id: articleIds,
      },
    });
    if (!eventArticle) {
      console.error(`Article non trouvé pour eventId: ${eventId}, articleId: ${articleIds}`);
      return res.status(404).send('Article non trouvé');
    }
    await eventArticle.update({ isValidated });
    res.sendStatus(204);
  } catch (err) {
    console.error('Erreur lors de la mise à jour de la validation de l\'article:', err);
    res.status(500).send(err.message);
  }
};



const invalidateArticle = async (req, res) => {
  const { eventId, articleIds } = req.params;
  const userRole = req.query.role;

  if (userRole !== 'photographe') {
    return res.status(403).send('Accès refusé');
  }

  try {
    const eventArticle = await EventArticle.findOne({
      where: {
        event_id: eventId,
        article_id: articleIds,
      },
    });

    if (!eventArticle) {
      return res.status(404).send('Article non trouvé');
    }

    await eventArticle.update({ isValidated: false });
    res.sendStatus(204);
  } catch (err) {
    console.error('Erreur lors de l\'invalidité de l\'article:', err);
    res.status(500).send(err.message);
  }
};


const getEventArticles = async (req, res) => {
  try {
    const eventArticles = await EventArticle.findAll();
    res.json(eventArticles);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  updateArticleValidation,
  invalidateArticle,
  getArticleValidationStatus,
  getEventArticles
};

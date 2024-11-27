const Decor = require('../models/modelsDecors');
const Article = require('../models/modelsArticles');
const DecorArticle = require('../models/modelsDecorArticles');
const jwt = require('jsonwebtoken');
const jwtSecret = 'YOUR_JWT_SECRET';


const getDecors = async (req, res) => {
  try {
    const decors = await Decor.findAll();
    res.json(decors);
  } catch (err) {
    res.status(500).send(err.message);
  }
};


const getDecorArticles = async (req, res) => {
  const { id } = req.params;
  try {
    const decor = await Decor.findByPk(id, {
      include: {
        model: Article,
        through: { attributes: [] }, 
      },
    });
    if (!decor) {
      return res.status(404).send('Decor not found');
    }
    res.json(decor.Articles);
  } catch (err) {
    res.status(500).send(err.message);
  }
};


const getDecorById = async (req, res) => {
  const { id } = req.params;
  try {
    const decor = await Decor.findByPk(id);
    if (!decor) {
      return res.status(404).send('Decor not found');
    }
    res.json(decor);
  } catch (err) {
    res.status(500).send(err.message);
  }
};


const createDecor = async (req, res) => {
  const { name, articleIds } = req.body;
  const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token,jwtSecret);
    const userId = decodedToken.userId;

  if (!name || !articleIds || articleIds.length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Le nom du décor et au moins 2 articles sont requis.',
    });
  }
  try {
    const validArticles = await Article.findAll({
      where: {
        id: articleIds,
        deteriorated: false,
        lost: false,
      },
    });

    const decor = await Decor.create({ name, user_id: userId, });

    if (validArticles.length > 0) {
      await decor.setArticles(validArticles); 
    }

    res.json({ id: decor.id, name });
  } catch (err) {
    res.status(500).send(err.message);
  }
};


const updateDecor = async (req, res) => {
  const { id } = req.params;
  const { name, articleIds } = req.body;
  const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token,jwtSecret);
    const userId = decodedToken.userId;

  if (!name || !articleIds || articleIds.length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Le nom du décor et au moins 2 articles sont requis.',
    });
  }
  try {
    const decor = await Decor.findByPk(id);
    if (!decor) {
      return res.status(404).json({ success: false, message: 'Decor not found' });
    }
    const validArticles = await Article.findAll({
      where: {
        id: articleIds,
        deteriorated: false,
        lost: false,
      },
    });

    await decor.update({ name, user_id: userId, });

    if (validArticles.length > 0) {
      await decor.setArticles(validArticles); 
    }

    res.json({ id, name });
  } catch (err) {
    res.status(500).send(err.message);
  }
};


const deleteDecor = async (req, res) => {
  const { id } = req.params;
  try {
    const decor = await Decor.findByPk(id);
    if (!decor) {
      return res.status(404).json({ success: false, message: 'Decor not found' });
    }

    await decor.destroy(); 
    res.json({ id });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getDecors,
  getDecorArticles,
  getDecorById,
  createDecor,
  updateDecor,
  deleteDecor,
};

const Article = require('../models/modelsArticles'); 
const jwt = require('jsonwebtoken');
const jwtSecret = 'YOUR_JWT_SECRET';


const getArticles = async (req, res) => {
  try {
    const articles = await Article.findAll();
    res.json(articles);
  } catch (err) {
    res.status(500).send(err.message);
  }
};


const getArticlesByIds = async (req, res) => {
  const ids = req.query.ids;

  if (!ids) {
    return res.status(400).json({ error: 'Parameter ids is required' });
  }

  const idArray = ids.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id));

  if (idArray.length === 0) {
    return res.status(400).json({ error: 'No valid IDs provided' });
  }

  try {
    const articles = await Article.findAll({
      where: {
        id: idArray
      }
    });

    res.json(articles);
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const createArticle = async (req, res) => {
  const { title, deteriorated = false, lost = false } = req.body;
  const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token,jwtSecret);
    const userId = decodedToken.userId;

  if (!title) {
    return res.status(400).json({
      success: false,
      message: 'Le titre de l\'article est requis.',
    });
  }

  try {
    const newArticle = await Article.create({ title, deteriorated, lost, user_id: userId, });
    res.status(201).json(newArticle);
  } catch (err) {
    res.status(400).send(err.message);
  }
};


const updateArticle = async (req, res) => {
  const { title, deteriorated, lost } = req.body;
  const { id } = req.params;
  const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token,jwtSecret);
    const userId = decodedToken.userId;

  if (!title) {
    return res.status(400).json({
      success: false,
      message: 'Le titre de l\'article est requis.',
    });
  }

  try {
    const [affectedRows] = await Article.update({ title, deteriorated, lost, user_id: userId, }, {
      where: { id },
    });

    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Article non trouvé' });
    }

    const updatedArticle = await Article.findByPk(id);
    res.json(updatedArticle);
  } catch (err) {
    res.status(400).send(err.message);
  }
};


const deleteArticle = async (req, res) => {
  const { id } = req.params;
  
  try {
    const deletedRows = await Article.destroy({
      where: { id },
    });

    if (deletedRows === 0) {
      return res.status(404).json({ success: false, message: 'Article non trouvé' });
    }

    res.json({ success: true, message: 'Article supprimé', id });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

module.exports = {
  getArticles,
  getArticlesByIds,
  createArticle,
  updateArticle,
  deleteArticle,
};

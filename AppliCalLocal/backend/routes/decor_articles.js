const express = require('express');
const decor_articlesControllers = require('../controllers/decor_articlesControllers');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/decor_id/:id',authMiddleware.verifyToken, decor_articlesControllers.getDecor_ArticleById);
router.get('/',authMiddleware.verifyToken, decor_articlesControllers.getDecorArticles);


module.exports = router;
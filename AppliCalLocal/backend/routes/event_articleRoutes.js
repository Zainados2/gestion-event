const express = require('express');
const { updateArticleValidation, invalidateArticle, getArticleValidationStatus, getEventArticles} = require('../controllers/event_article');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/event_id/:eventId/article_id/:articleId/isValidated',authMiddleware.verifyToken, getArticleValidationStatus);
router.get('/',authMiddleware.verifyToken, getEventArticles);

router.patch('/event_id/:eventId/article_id/:articleIds/isValidated',authMiddleware.verifyToken, updateArticleValidation);
router.patch('/event_id/:eventId/article_id/:articleIds/isValidated',authMiddleware.verifyToken, invalidateArticle);

module.exports = router;
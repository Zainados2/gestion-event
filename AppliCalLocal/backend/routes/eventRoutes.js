const express = require('express');
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/',authMiddleware.verifyToken, authMiddleware.verifyRole('gerant'), eventController.createEvent);

router.get('/',authMiddleware.verifyToken, eventController.getEvents);

router.put('/:id',authMiddleware.verifyToken, authMiddleware.verifyRole('gerant'), eventController.updateEvent);

router.delete('/:id',authMiddleware.verifyToken, authMiddleware.verifyRole('gerant'), eventController.deleteEvent);

module.exports = router;
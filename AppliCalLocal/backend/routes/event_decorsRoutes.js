const express = require('express');
const event_decorsControllers = require('../controllers/event_decorsControllers');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.patch('/event_id/:eventId/decor_id/:decor_id/validation_decors',authMiddleware.verifyToken, event_decorsControllers.updateDecorValidation);
router.patch('/event_id/:eventId/decor_id/:decor_id/validation_decors',authMiddleware.verifyToken, event_decorsControllers.invalidateDecors);

router.get('/event_id/:eventId/decor_id/:decor_id/validation_decors',authMiddleware.verifyToken, event_decorsControllers.getDecorsValidationStatus)

router.patch('/event_id/:eventId/decor_id/:decor_id/montage_decors',authMiddleware.verifyToken, event_decorsControllers.updateDecorMontage);
router.patch('/event_id/:eventId/decor_id/:decor_id/montage_decors',authMiddleware.verifyToken, event_decorsControllers.invalidateDecorsMontage);

router.get('/event_id/:eventId/decor_id/:decor_id/montage_decors',authMiddleware.verifyToken, event_decorsControllers.getDecorsMontageStatus)

router.patch('/event_id/:eventId/decor_id/:decor_id/demontage_decors',authMiddleware.verifyToken, event_decorsControllers.updateDecorDemontage);
router.patch('/event_id/:eventId/decor_id/:decor_id/demontage_decors',authMiddleware.verifyToken, event_decorsControllers.invalidateDecorsDemontage);

router.get('/event_id/:eventId/decor_id/:decor_id/demontage_decors',authMiddleware.verifyToken, event_decorsControllers.getDecorsDemontageStatus)
router.get('/',authMiddleware.verifyToken, event_decorsControllers.getEventDecors)

module.exports = router;
const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/',authMiddleware.verifyToken, addressController.getAllAddresses);

router.get('/:id',authMiddleware.verifyToken, addressController.getAddressById);

router.post('/',authMiddleware.verifyToken, authMiddleware.verifyRole('gerant'), addressController.createAddress);

router.put('/:id',authMiddleware.verifyToken, authMiddleware.verifyRole('gerant'), addressController.updateAddress);

router.delete('/:id',authMiddleware.verifyToken, authMiddleware.verifyRole('gerant'), addressController.deleteAddress);

module.exports = router;

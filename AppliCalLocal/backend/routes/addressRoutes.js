const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const authMiddleware = require('../middleware/authMiddleware');

// Get all addresses
router.get('/',authMiddleware.verifyToken, addressController.getAllAddresses);

router.get('/:id',authMiddleware.verifyToken, addressController.getAddressById);

// Create a new address
router.post('/',authMiddleware.verifyToken, authMiddleware.verifyRole('gerant'), addressController.createAddress);

// Update an address
router.put('/:id',authMiddleware.verifyToken, authMiddleware.verifyRole('gerant'), addressController.updateAddress);

// Delete an address
router.delete('/:id',authMiddleware.verifyToken, authMiddleware.verifyRole('gerant'), addressController.deleteAddress);

module.exports = router;

const Address = require('../models/modelsAdresses');
const jwt = require('jsonwebtoken');
const jwtSecret = 'YOUR_JWT_SECRET';
// Get all addresses
const getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.findAll();
    res.json(addresses);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Get address by ID
const getAddressById = async (req, res) => {
  const { id } = req.params;
  try {
    const address = await Address.findByPk(id);
    if (!address) {
      return res.status(404).send('Address not found');
    }
    res.json(address);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Create a new address
const createAddress = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token,jwtSecret);
    const userId = decodedToken.userId;
  const { name, location, type } = req.body;

  // Validation des champs
  if (!name || !location || !type) {
    return res.status(400).send('Tous les champs sont requis.');
  }

  try {
    const newAddress = await Address.create({ name, location, type, user_id: userId, });
    res.status(201).json(newAddress);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const updateAddress = async (req, res) => {
  const { id } = req.params;
  const { name, location, type } = req.body;
  const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token,jwtSecret);
    const userId = decodedToken.userId;

  // Validation des champs
  if (!name || !location || !type) {
    return res.status(400).send('Tous les champs sont requis.');
  }

  try {
    const [affectedRows] = await Address.update({ name, location, type, user_id: userId, }, {
      where: { id },
    });
    if (affectedRows === 0) {
      return res.status(404).send('Adresse non trouvée');
    }
    const updatedAddress = await Address.findByPk(id);
    res.json(updatedAddress);
  } catch (err) {
    res.status(400).send(err.message);
  }
};


// Delete an address
const deleteAddress = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRows = await Address.destroy({
      where: { id },
    });
    if (deletedRows === 0) {
      return res.status(404).send('Address not found');
    }
    res.json({ message: 'Address deleted' });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

module.exports = {
  getAllAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
};

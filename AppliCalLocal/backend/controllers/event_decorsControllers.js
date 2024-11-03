const EventDecor = require('../models/modelsEventDecor');
const { Op } = require('sequelize');

const updateDecorValidation = async (req, res) => {
  const { eventId, decor_id } = req.params;
  const userRole = req.query.role;
  const { validation_decors } = req.body;

  if (userRole !== 'photographe') {
    return res.status(403).send('Accès refusé');
  }

  try {
    const eventDecor = await EventDecor.findOne({
      where: {
        event_id: eventId,
        decor_id,
      },
    });

    if (!eventDecor) {
      return res.status(404).send('Décor non trouvé');
    }

    await eventDecor.update({ validation_decors });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const invalidateDecors = async (req, res) => {
  const { eventId, decor_id } = req.params;
  const userRole = req.query.role;

  if (userRole !== 'photographe') {
    return res.status(403).send('Accès refusé');
  }

  try {
    const eventDecor = await EventDecor.findOne({
      where: {
        event_id: eventId,
        decor_id,
      },
    });

    if (!eventDecor) {
      return res.status(404).send('Décor non trouvé');
    }

    await eventDecor.update({ validation_decors: false });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getDecorsValidationStatus = async (req, res) => {
  const { eventId, decor_id } = req.params;
  const userRole = req.query.role;

  if (userRole !== 'photographe' && userRole !== 'gerant') {
    return res.status(403).send('Accès refusé');
  }

  try {
    const eventDecor = await EventDecor.findOne({
      where: {
        event_id: eventId,
        decor_id,
      },
    });

    if (!eventDecor) {
      return res.status(404).send('Décor non trouvé');
    }

    res.json({ validation_decors: eventDecor.validation_decors });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateDecorMontage = async (req, res) => {
  const { eventId, decor_id } = req.params;
  const userRole = req.query.role;
  const  montage_decors  = req.body.decorMontageStatus;

  console.log(req.params)
  console.log(req.body)
  console.log(montage_decors)

  if (userRole !== 'decorateur') {
    return res.status(403).send('Accès refusé');
  }

  try {
    const eventDecor = await EventDecor.findOne({
      where: {
        event_id: eventId,
        decor_id,
      },
    });

    if (!eventDecor) {
      return res.status(404).send('Décor non trouvé');
    }

    await eventDecor.update({ montage_decors });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const invalidateDecorsMontage = async (req, res) => {
  const { eventId, decor_id } = req.params;
  const userRole = req.query.role;

  if (userRole !== 'decorateur') {
    return res.status(403).send('Accès refusé');
  }

  try {
    const eventDecor = await EventDecor.findOne({
      where: {
        event_id: eventId,
        decor_id,
      },
    });

    if (!eventDecor) {
      return res.status(404).send('Décor non trouvé');
    }

    await eventDecor.update({ montage_decors: false });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getDecorsMontageStatus = async (req, res) => {
  const { eventId, decor_id } = req.params;
  const userRole = req.query.role;

  if (userRole !== 'decorateur' && userRole !== 'gerant') {
    return res.status(403).send('Accès refusé');
  }

  try {
    const eventDecor = await EventDecor.findOne({
      where: {
        event_id: eventId,
        decor_id,
      },
    });

    if (!eventDecor) {
      return res.status(404).send('Décor non trouvé');
    }

    res.json({ montage_decors: eventDecor.montage_decors });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateDecorDemontage = async (req, res) => {
  const { eventId, decor_id } = req.params;
  const userRole = req.query.role;
  const  demontage_decors  = req.body.decorDemontageStatus;

  if (userRole !== 'decorateur') {
    return res.status(403).send('Accès refusé');
  }

  try {
    const eventDecor = await EventDecor.findOne({
      where: {
        event_id: eventId,
        decor_id,
      },
    });

    if (!eventDecor) {
      return res.status(404).send('Décor non trouvé');
    }

    await eventDecor.update({ demontage_decors });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const invalidateDecorsDemontage = async (req, res) => {
  const { eventId, decor_id } = req.params;
  const userRole = req.query.role;

  if (userRole !== 'decorateur') {
    return res.status(403).send('Accès refusé');
  }

  try {
    const eventDecor = await EventDecor.findOne({
      where: {
        event_id: eventId,
        decor_id,
      },
    });

    if (!eventDecor) {
      return res.status(404).send('Décor non trouvé');
    }

    await eventDecor.update({ demontage_decors: false });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getDecorsDemontageStatus = async (req, res) => {
  const { eventId, decor_id } = req.params;
  const userRole = req.query.role;

  if (userRole !== 'decorateur' && userRole !== 'gerant') {
    return res.status(403).send('Accès refusé');
  }

  try {
    const eventDecor = await EventDecor.findOne({
      where: {
        event_id: eventId,
        decor_id,
      },
    });

    if (!eventDecor) {
      return res.status(404).send('Décor non trouvé');
    }

    res.json({ demontage_decors: eventDecor.demontage_decors });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getEventDecors = async (req, res) => {
  try {
    const eventDecors = await EventDecor.findAll();
    res.json(eventDecors);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  updateDecorValidation,
  invalidateDecors,
  getDecorsValidationStatus,
  updateDecorMontage,
  getDecorsMontageStatus,
  invalidateDecorsMontage,
  updateDecorDemontage,
  getDecorsDemontageStatus,
  invalidateDecorsDemontage,
  getEventDecors
};

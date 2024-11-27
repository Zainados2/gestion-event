const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const Event = require('../models/modelsEvent');
const  {addArticlesToEvent} = require('../services/addArticlesToEvent');
const   {addEventAddress}  = require('../services/addEventAddress');
const {addDecorsToEvent} = require('../services/addDecorsToEvent');
const  {isDecorProblematic}  = require('../services/isDecorProblematic');
const {validateArticles}  = require('../services/validateArticles');
const {removeAddressFromEvent}  = require('../services/removeAddressFromEvent');
const {removeArticlesFromEvent}  = require('../services/removeArticlesFromEvent');
const {removeDecorsFromEvent}  = require('../services/removeDecorsFromEvent');

const jwtSecret = 'YOUR_JWT_SECRET';


   const createEvent = async (req, res) => {
    const event = req.body;
    
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token,jwtSecret);
    const userId = decodedToken.userId;
    try {
      const requiredFields = ['title', 'start', 'end', 'description', 'participants', 'location_type', 'address_id'];
      for (const field of requiredFields) {
        if (!event[field]) {
          return res.status(400).json({ error: `Le champ ${field} est requis.` });
        }}
      if (event.location_type === 'studio') {
        if (!event.article_ids) {
          return res.status(400).json({ error: 'Le champ article_ids est requis' });
        }
        if (event.decor_id) {
          return res.status(400).json({ error: 'Le champ decor_id ne doit pas etre completé' });
        }
      } else {
        if (!event.decor_id) {
          return res.status(400).json({ error: 'Le champ decor_id est requis' });
        }
       if (event.article_ids) {
         return res.status(400).json({ error: 'Le champ article_ids ne doit pas etre completé' });
      }}
      if (event.decor_id) {
        const isProblematicDecor = await isDecorProblematic(event.decor_id);
        if (isProblematicDecor) {
          return res.status(400).json({ error: `Le décor ${event.decor_id} est problématique.` });
        }
      }
      if (event.article_ids) {
        const articleIds = event.article_ids.split(',')
          .map(id => parseInt(id.trim(), 10))
          .filter(id => !isNaN(id));
        const hasProblematicArticles = await validateArticles(articleIds);
        if (hasProblematicArticles) {
          return res.status(400).json({ error: 'Certains articles sélectionnés sont problématiques.' , articleIds });
        }
      }
  
      const defaultParticipant = 'gerant';
      const participantsArray = event.participants ? event.participants.split(',').map(p => p.trim()) : [];
      participantsArray.push(defaultParticipant);
      const uniqueParticipants = Array.from(new Set(participantsArray)).join(', ');
  
      const newEvent = await Event.create({
        ...event,
        participants: uniqueParticipants,
        user_id: userId,
        article_ids: event.article_ids,
      });
  
      if (event.article_ids) {
        const articleIds = event.article_ids.split(',')
          .map(id => parseInt(id.trim(), 10))
          .filter(id => !isNaN(id));
        await addArticlesToEvent(newEvent.id, articleIds);
      }
  
      if (event.decor_id) {
        await addDecorsToEvent(newEvent.id, event.decor_id);
      }
  
      if (event.address_id) {
        await addEventAddress(newEvent.id, event.address_id);
      }
  
      res.status(201).json({
        message: 'Event créé',
        event: newEvent
      });
  
    } catch (error) {
      console.error('Erreur lors de la création de l\'événement :', error);
      res.status(500).send({ error: error.message, details: error.errors });
    }
  };;



const getEvents = async (req, res) => {
  const userRole = req.query.role;

  try {
    let events;
    if (userRole === 'gerant') {
      events = await Event.findAll({ order: [['id', 'ASC']] });
    } else if (userRole === 'photographe' || userRole === 'decorateur' || userRole === 'decorateur' || userRole === 'chauffeur') {
      events = await Event.findAll({
        where: {
          participants: {
            [Op.like]: `%${userRole}%`
          }
        },
        order: [['id', 'ASC']]
      });
    } else {
      return res.status(403).send('Accès refusé');
    }
    res.json(events);
  } catch (error) {
    res.status(500).send(error.message);
  }
};



const updateEvent = async (req, res) => {
  const eventId = req.params.id;
  const updatedEvent = req.body;

  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, jwtSecret);
    const userId = decodedToken.userId;

    const requiredFields = ['title', 'start', 'end', 'description', 'participants', 'location_type', 'address_id'];
    for (const field of requiredFields) {
      if (!updatedEvent[field]) {
        return res.status(400).json({ error: `Le champ ${field} est requis.` });
      }
    }

    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Événement non trouvé.' });
    }

    let articleIds = [];
    if (updatedEvent.article_ids) {
      await removeDecorsFromEvent(eventId);
      await event.update({ decor_id: null });

      articleIds = updatedEvent.article_ids.split(',')
        .map(id => parseInt(id.trim(), 10))
        .filter(id => !isNaN(id));

      await removeArticlesFromEvent(eventId);
      await addArticlesToEvent(eventId, articleIds);
    } else if (updatedEvent.decor_id) {
      await removeArticlesFromEvent(eventId);
      await event.update({ article_ids: null });

      await removeDecorsFromEvent(eventId);
      await addDecorsToEvent(eventId, updatedEvent.decor_id);
    } else {
      await removeArticlesFromEvent(eventId);
      await removeDecorsFromEvent(eventId);
      await event.update({ article_ids: null, decor_id: null });
    }

    const defaultParticipant = 'gerant';
    const newParticipants = updatedEvent.participants ? updatedEvent.participants.split(',').map(p => p.trim()) : [];
    if (!newParticipants.includes(defaultParticipant)) {
      newParticipants.push(defaultParticipant);
    }
    const uniqueParticipants = Array.from(new Set(newParticipants)).join(', ');

    await event.update({
      ...updatedEvent,
      participants: uniqueParticipants,
      user_id: userId,
      article_ids: articleIds.join(','), 
    });

    if (event.address_id !== updatedEvent.address_id) {
      await removeAddressFromEvent(eventId);
      if (updatedEvent.address_id) {
        await addEventAddress(eventId, updatedEvent.address_id);
      }
    }

    if (event.location_type === 'studio') {
      await event.update({ decor_id: null });
    }

    res.json(await Event.findByPk(eventId));
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'événement :', error);
    res.status(500).send({ error: error.message, details: error.errors });
  }
};





const deleteEvent = async (req, res) => {
  const eventId = req.params.id;

  try {
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Événement non trouvé.' });
    }

    await event.destroy();

    await removeArticlesFromEvent(eventId);
    await removeDecorsFromEvent(eventId);
    await removeAddressFromEvent(eventId);

    res.status(204).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
};


module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
};
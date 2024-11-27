const express = require('express');
const cors = require('cors');
const sequelize = require('../backend/models/db'); 
const helmet = require('helmet'); 
const articleRoutes = require('./routes/articleRoutes');
const decorRoutes = require('./routes/decorRoutes');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');
const addressRoutes = require('./routes/addressRoutes');
const decor_articles = require('./routes/decor_articles');
const event_articles = require('./routes/event_articleRoutes');
const event_decors = require('./routes/event_decorsRoutes');


const app = express();
const port = 8081;

const corsOptions = {
  origin: [
    'http://165.232.115.209:3000'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true, 
};


app.use(cors(corsOptions));


app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "http://165.232.115.209:3000", "http://165.232.115.209:8080", "http://165.232.115.209:8081"],
    objectSrc: ["'none'"],
    frameAncestors: ["'none'"],
    connectSrc: ["'self'", "http://165.232.115.209:3000", "http://165.232.115.209:8080", "http://165.232.115.209:8081"],
    imgSrc: ["'self'", "data:", "http://165.232.115.209:8080", "http://165.232.115.209:8081"], 
  }
}));
app.use(helmet.noSniff());
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.xssFilter());
app.use(helmet.hidePoweredBy()); 
app.use(helmet.dnsPrefetchControl({ allow: false })); 
app.use(helmet.permittedCrossDomainPolicies()); 
app.use(helmet.referrerPolicy({ policy: 'origin-when-cross-origin' }));



app.use(express.json());

app.use('/articles', articleRoutes);
app.use('/decors', decorRoutes);
app.use('/events', eventRoutes);
app.use('/addresses', addressRoutes);
app.use('/decor_articles', decor_articles);
app.use('/event_articles', event_articles);
app.use('/event_decors', event_decors);
app.use('/', userRoutes);

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true }); 
    console.log('Modèles synchronisés avec la base de données.');
  } catch (error) {
    console.error('Erreur de synchronisation des modèles:', error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  syncDatabase().then(() => {
    app.listen(port, () => {
      console.log(`Serveur backend en écoute sur le port ${port}`);
    });
  });
}

module.exports = app;

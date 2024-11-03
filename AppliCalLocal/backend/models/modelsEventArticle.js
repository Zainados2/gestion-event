const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./db');
const Event = require('./modelsEvent');
const Article = require('./modelsArticles');

const EventArticle = sequelize.define('EventArticle', {
  event_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  article_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  isValidated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'event_articles',
  timestamps: false
});


Event.belongsToMany(Article, { through: EventArticle, foreignKey: 'event_id' });
Article.belongsToMany(Event, { through: EventArticle, foreignKey: 'article_id' });

module.exports = EventArticle;

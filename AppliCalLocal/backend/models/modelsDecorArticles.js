const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./db');
const Decor = require('./modelsDecors');
const Article = require('./modelsArticles'); 

const DecorArticle = sequelize.define('DecorArticle', {
  decor_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Decor,
      key: 'id',
    },
    allowNull: false,
  },
  article_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Article,
      key: 'id',
    },
    allowNull: false,
  },
}, {
  tableName: 'decor_articles',
  timestamps: false,
});

Decor.belongsToMany(Article, { through: DecorArticle, foreignKey: 'decor_id' });
Article.belongsToMany(Decor, { through: DecorArticle, foreignKey: 'article_id' });

module.exports = DecorArticle;

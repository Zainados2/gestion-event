const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./db'); 

const Article = sequelize.define('Article', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deteriorated: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  lost: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  tableName: 'articles', 
  timestamps: false,
});

module.exports = Article;

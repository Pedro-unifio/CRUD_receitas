const path = require('path');
const { Sequelize } = require('sequelize');
module.exports = new Sequelize({ dialect: 'sqlite', storage: process.env.DB_PATH || path.join(__dirname, '../dados.sqlite'), logging: false });

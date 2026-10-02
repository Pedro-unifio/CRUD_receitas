const { DataTypes } = require('sequelize');
const database = require('./database');
module.exports = database.define('Receita', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  categoria: { type: DataTypes.STRING(60), allowNull: false },
  tempoMinutos: { type: DataTypes.INTEGER, allowNull: false },
  porcoes: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'receitas', timestamps: false });

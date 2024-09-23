// models/multimedia.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Multimedia = sequelize.define('Multimedia', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_evento: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  enlace_contenido: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT
  }
});

module.exports = Multimedia;

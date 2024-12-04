// models/evento.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Evento = sequelize.define('Evento', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  lugar: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  enlace_pdf: {
    type: DataTypes.STRING
  },
  enlace_entradas: {
    type: DataTypes.STRING
  },
  tipo: {
    type: DataTypes.ENUM('concierto', 'charla', 'individual'),
    allowNull: false
  }
});

module.exports = Evento;

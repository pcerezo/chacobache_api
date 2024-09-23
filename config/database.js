// config/database.js
const { Sequelize } = require('sequelize');

// Crea una instancia de Sequelize
const sequelize = new Sequelize('chacobache_dev', 'pablo', 'password', {
  host: '127.0.0.1',         // Cambia si es un servidor remoto
  dialect: 'mysql',
  logging: false,            // Desactiva el logging de las consultas SQL en consola
});

module.exports = sequelize;

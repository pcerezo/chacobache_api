// config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Crea una instancia de Sequelize

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  // Cambia si es un servidor remoto
  host: process.env.DB_HOST,
  port: '3306',
  dialect: 'mysql',
  dialectOptions: {
    charset: 'utf8mb4',
  },
  logging: true,            // Desactiva el logging de las consultas SQL en consola
});

module.exports = sequelize;

// config/database.js
const { Sequelize } = require('sequelize');

// Crea una instancia de Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
//  host: '127.0.0.1',         // Cambia si es un servidor remoto
  host: process.env.DB_HOST,
  port: '3306',
  dialect: 'mysql',
  dialectOptions: {
    charset: 'utf8mb4',
  },
  logging: false,            // Desactiva el logging de las consultas SQL en consola
});

module.exports = sequelize;

// config/database.js
const { Sequelize } = require('sequelize');

// Crea una instancia de Sequelize
/*
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
*/

const sequelize = new Sequelize("lbb7y0hcoqdbe2wm", "oykr0yr7noc59yr8", "mpdr0pn5fwcwynnb", {
  // Cambia si es un servidor remoto
  host: "ol5tz0yvwp930510.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  port: '3306',
  dialect: 'mysql',
  dialectOptions: {
    charset: 'utf8mb4',
  },
  logging: true,            // Desactiva el logging de las consultas SQL en consola
});

module.exports = sequelize;

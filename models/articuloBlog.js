const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ArticuloBlog = sequelize.define('Articulo_Blog', {
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    titulo: { 
        type: DataTypes.STRING 
    },
    contenido: { 
        type: DataTypes.TEXT 
    },
    autor: { 
        type: DataTypes.STRING 
    },
    fecha_publicacion: { 
        type: DataTypes.DATE 
    },
    url_imagen: {
        type: DataTypes.STRING,
    },
    tags: { 
        type: DataTypes.STRING 
    }
});

module.exports = ArticuloBlog;
  
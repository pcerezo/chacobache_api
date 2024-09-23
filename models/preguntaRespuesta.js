const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PreguntaRespuesta = sequelize.define('Pregunta_Respuesta', {
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    asunto: { 
        type: DataTypes.STRING 
    },
    texto_pregunta: { 
        type: DataTypes.TEXT 
    },
    texto_respuesta: { 
        type: DataTypes.TEXT 
    },
    fecha_publicacion: { 
        type: DataTypes.DATE
    }
});

module.exports = PreguntaRespuesta;
  
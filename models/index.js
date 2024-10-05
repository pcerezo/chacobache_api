const sequelize = require('../config/database');
const Evento = require('./evento');
const Multimedia = require('./multimedia');
const ArticuloBlog = require('./articuloBlog');
const PreguntaRespuesta = require('./preguntaRespuesta');

// Relaciones (si existen, por ejemplo: un Evento puede tener Multimedia)
Evento.hasMany(Multimedia, { foreignKey: 'id_evento' });
Multimedia.belongsTo(Evento, { foreignKey: 'id_evento' });

module.exports = {
  sequelize,
  Evento,
  Multimedia,
  ArticuloBlog,
  PreguntaRespuesta
};

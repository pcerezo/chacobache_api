const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();


const app = express();
app.use(cors({
  origin: 'https://pcerezo.github.io', // Tu frontend en GitHub Pages
}));
app.use(express.json());

// Rutas de eventos
const eventRoutes = require('./routes/eventRoutes');
app.use('/api/', eventRoutes);

// TODO: Servir los PDFs subidos desde el directorio "uploads"
app.use('/uploads', express.static('uploads'));

// Sincronizar modelos con la base de datos
sequelize.sync({ force: false })  // Usar `force: true` para borrar y recrear tablas cada vez
  .then(() => {
    console.log("Conexión con la base de datos y sincronización exitosa.");
  })
  .catch(err => {
    console.error("Error al sincronizar la base de datos:", err);
  });

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST;
const NODE_ENV = process.env.NODE_ENV;
const DB_USER = process.env.DB_USER;
//console.log("NODE_ENV: " + NODE_ENV + ", DB_USER: " + DB_USER);
app.listen(PORT, () => {
  console.log(`Servidor corriendo en https://${HOST}:${PORT}`);
});

module.exports = app;
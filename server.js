const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
require('dotenv').config();

const app = express();
app.use(cors());
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
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

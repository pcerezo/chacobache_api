const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas de eventos
const eventRoutes = require('./routes/eventRoutes');
app.use('/api/events', eventRoutes);

// Servir los PDFs subidos desde el directorio "uploads"
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

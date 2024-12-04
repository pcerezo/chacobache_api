const path = require('path');
const fs = require('fs');

// Obtener lista de eventos
exports.getEvents = (req, res) => {
  // Aquí se añadiría la lógica para buscar eventos en la base de datos
  res.send([{ name: 'Concierto Enero 2024', date: '2024-01-15' }]);
};

// Subir un archivo PDF
exports.uploadPdf = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Por favor sube un archivo PDF.' });
  }
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ message: 'Archivo subido correctamente', fileUrl: fileUrl });
};

const jwt = require('jsonwebtoken');
require('dotenv').config();

// Clave secreta para verificar el token (debe coincidir con la usada en la generación del token)
const JWT_SECRET = process.env.JWT_SECRET; // Cambia esto por una clave segura

// Middleware para autenticar tokens
function authenticateToken(req, res, next) {
  // Obtener el token del encabezado Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader;

  // Si no se proporciona token
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado. Acceso denegado.' });
  }

  // Verificar el token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token no válido o expirado.' });
    }

    // Si el token es válido, almacena la información del usuario en la solicitud
    req.user = decoded;
    next();
  });
}

module.exports = authenticateToken;

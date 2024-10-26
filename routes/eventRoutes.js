const express = require('express');
const { Evento, Multimedia, PreguntaRespuesta } = require('../models');
const router = express.Router();
const { Op } = require('sequelize'); // Importa operadores de Sequelize
const nodemailer = require('nodemailer');
require('dotenv').config();

// Define tus rutas aquí
router.get('/', (req, res) => {
  res.send('Hello World');
});

// ---------- EVENTOS ----------
// Get eventos pasados
router.get('/eventos/historialEventosPasados', async (req, res) => {
  try {
    const eventos = await Evento.findAll({
      attributes: ['id', 'lugar', 'fecha', 'descripcion', 'enlace_entradas'],
      where: {
        fecha: {
          [Op.lt]: new Date() // Filtra eventos cuya fecha sea menor que la actual
        }
      },
      order: [['fecha', 'ASC']] // Ordena los eventos por fecha ascendente (opcional)
    });

    res.json(eventos);
  } catch (error) {
    console.error('Error al obtener los eventos:', error);
    res.status(500).json({ error: 'Error al obtener los eventos' });
  }
});

// Get eventos futuros
router.get('/eventos/historialEventosFuturos', async (req, res) => {
  try {
    const eventos = await Evento.findAll({
      attributes: ['id', 'lugar', 'fecha', 'descripcion', 'enlace_entradas'],
      where: {
        fecha: {
          [Op.gt]: new Date() // Filtra eventos cuya fecha sea mayor que la actual
        }
      },
      order: [['fecha', 'ASC']] // Ordena los eventos por fecha ascendente (opcional)
    });

    res.json(eventos);
  } catch (error) {
    console.error('Error al obtener los eventos futuros:', error);
    res.status(500).json({ error: 'Error al obtener los eventos futuros' });
  }
});

// Enviar correo de solicitud de producción musical
router.post('/eventos/solicitudProduccionMusical', async(req, res) => {
  console.log("En el back del envío");
  const { nombre, email, mensaje } = req.body;

  // Configuración del transporte (esto puede cambiar según el servicio SMTP)
  const transporter = nodemailer.createTransport({
    service: 'gmail', // o cualquier otro servicio
    auth: {
      user: process.env.EMAIL_USER, // tu correo
      pass: process.env.EMAIL_CODE // tu contraseña
    }
  });

  // Detalles del correo
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_DESTINO,
    subject: "Solicitud de producción musical de " + nombre,
    text: "Tienes una solicitud de encuentro de producción musical de parte de " + nombre + " cuyo correo es " + email + ". \n\n" 
      + "\"" + mensaje + "\""
  };

  // Envío del correo
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error al enviar el correo: ' + error);
      res.status(500).json({status: 500, message: 'Error al enviar el correo: ' + error});
    } else {
      console.log('Correo enviado: ' + info.response);
      res.status(200).json({status: 200, message: 'Correo enviado'});
    }
  });
});

// ----------- MULTIMEDIA ----------
// Obtener multimedia de un evento
router.get('/eventos/historialEventosPasadosMultimedia', async (req, res) => {
  try {
    const eventos = await Evento.findAll({
      attributes: ['id', 'lugar', 'fecha', 'descripcion'],
      where: {
        fecha: {
          [Op.lt]: new Date() // Filtra eventos cuya fecha sea menor que la actual
        }
      },
      include: [
        {
          model: Multimedia,
          required: true
        }
      ],
      order: [['fecha', 'ASC']],
      logging: console.log
    });

    res.json(eventos);
  } catch(error) {
    console.error('Error al obtener los eventos:', error);
    res.status(500).json({ error: 'Error al obtener los eventos' });
  }
});

// -------- PREGUNTAS FRECUENTES ----------
router.get('/contacto/preguntasFrecuentes', async (req, res) => {
  try {
    const preguntasFrecuentes = await PreguntaRespuesta.findAll({
      attributes: ['asunto', 'texto_pregunta', 'texto_respuesta', 'fecha_publicacion'],
      order: [['fecha_publicacion', 'ASC']],
      logging: console.log
    });
    res.json(preguntasFrecuentes);
  } catch(error) {
    console.error('Error al obtener las preguntas frecuentes: ', error);
    res.status(500).json({ error: 'Error al obtener las preguntas frecuentes' });
  }
});


// Ruta para obtener la lista de proyectos con información resumida
/*
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.findAll({
      attributes: ['id', 'title', 'short_description', 'start_date', 'end_date', 'client', 'role'],
      include: [
        {
          model: Technology,
          as: 'Technologies',
          attributes: ['name']
        },
        {
          model: Category,
          as: 'Categories',
          attributes: ['name']
        },
        {
          model: ProjectImage,
          as: 'images',
          attributes: ['image_url', 'alt_text', 'order']
        }
      ]
    });

    res.json(projects);
  } catch (error) {
    console.error('Error al obtener los proyectos:', error);
    res.status(500).json({ error: 'Error al obtener los proyectos' });
  }
});

// Ruta para obtener los detalles de un proyecto específico
app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        {
          model: Technology,
          as: 'Technologies',
          attributes: ['name']
        },
        {
          model: Category,
          as: 'Categories',
          attributes: ['name']
        },
        {
          model: ProjectImage,
          as: 'images',
          attributes: ['image_url', 'alt_text', 'order']
        }
      ]
    });

    if (!project) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error al obtener el proyecto:', error);
    res.status(500).json({ error: 'Error al obtener el proyecto' });
  }
});
*/

module.exports = router;
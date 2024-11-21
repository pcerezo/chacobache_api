const express = require('express');
const { Evento, Multimedia, PreguntaRespuesta, ArticuloBlog } = require('../models');
const router = express.Router();
const { Op } = require('sequelize'); // Importa operadores de Sequelize
const nodemailer = require('nodemailer');
require('dotenv').config();

// Define tus rutas aquí
router.get('/', (req, res) => {
  res.send('Hello World');
});

// Configuración del transporte (esto puede cambiar según el servicio SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail', // o cualquier otro servicio
  auth: {
    user: process.env.EMAIL_USER, // tu correo
    pass: process.env.EMAIL_CODE // tu contraseña
  }
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
        },
        tipo: {
          [Op.ne]: 'individual'
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
        },
        tipo: {
          [Op.ne]: 'individual'
        }
      },
      order: [['fecha', 'ASC']] // Ordena los eventos por fecha ascendente (opcional)
    });
    console.log("Encontrados eventos futuros");
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
// Obtener todas las preguntas guardadas
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

// Enviar email con preguntas de interesados.
router.post('/contacto/enviarPregunta', async (req, res) => {
  console.log("En el back del envío");
  const { nombre, email, asunto, pregunta } = req.body;

  if (email != undefined && email != "") {
    var cuerpo = "Tienes una pregunta de parte de " + nombre + " cuyo correo es " + email + ". \n\n" + "\"" + pregunta + "\"";
  }
  else {
    var cuerpo = "Tienes una pregunta de parte de " + nombre + ". \n\n" + "\"" + pregunta + "\"";
  }
  
  // Detalles del correo
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_DESTINO,
    subject: "Chacobacheweb: " + asunto,
    text: cuerpo
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

// -------- BLOG --------
router.get('/blog/articulos', async (req, res) => {
  try {
    const articulos = await ArticuloBlog.findAll({
      attributes: ['id', 'titulo', 'contenido', 'autor', 'fecha_publicacion', 'url_imagen', 'tags'],
      order: [['fecha_publicacion', 'ASC']],
      logging: console.log
    });
    res.json(articulos);
  } catch(error) {
    console.error('Error al obtener los blogs: ', error);
    res.status/(500).json({ error: 'Error al obtener los blogs: ' + error});
  }
});

router.get('/blog/articulosPagina/:page', async (req, res) => {
  try {
    const page = req.params.page;
    const limit = 5;
    const offset = (page - 1) * limit;
    const articulos = await ArticuloBlog.findAll({
      attributes: ['id', 'titulo', 'contenido', 'autor', 'fecha_publicacion', 'url_imagen', 'tags'],
      order: [['fecha_publicacion', 'ASC']],
      limit: limit,
      offset: offset,
      logging: console.log
    });
    res.json(articulos);
  } catch(error) {
    console.error('Error al obtener los blogs: ', error);
    res.status/(500).json({ error: 'Error al obtener los blogs: ' + error});
  }
});

router.get('/blog/detallesArticulo/:id', async (req, res) => {
  try {
    const articulo = await ArticuloBlog.findOne({
      where: { id: req.params.id },  // Agrega el filtro `where` para encontrar el artículo por id
      attributes: ['id', 'titulo', 'contenido', 'autor', 'fecha_publicacion', 'url_imagen', 'tags'],
      order: [['fecha_publicacion', 'ASC']],
      logging: console.log
    });
    console.log("Articulo: " + articulo);
    res.json(articulo);
  } catch(error) {
    console.error('Error al obtener el artículo: ', error);
    res.status(500).json({ error: 'Error al obtener el artículo: ' + error});
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
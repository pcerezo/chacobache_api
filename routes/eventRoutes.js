const express = require('express');
const { Evento, Multimedia, PreguntaRespuesta, ArticuloBlog, User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { Op, where } = require('sequelize'); // Importa operadores de Sequelize
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
require('dotenv').config();


const JWT_SECRET = process.env.JWT_SECRET;

// Define tus rutas aquí
router.get('/test/saludo', (req, res) => {
  res.json({ message:'Hello World'});
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

// Get eventos futuros
router.get('/eventos/historialEventos', async (req, res) => {
  try {
    const eventos = await Evento.findAll({
      attributes: ['id', 'lugar', 'fecha', 'descripcion', 'enlace_entradas'],
      where: {
        tipo: {
          [Op.ne]: 'individual'
        }
      },
      order: [['fecha', 'ASC']] // Ordena los eventos por fecha ascendente (opcional)
    });
    console.log("Encontrados todos los eventos");
    res.json(eventos);
  } catch (error) {
    console.error('Error al obtener todos los eventos:', error);
    res.status(500).json({ error: 'Error al obtener todos los eventos' });
  }
});

// Get info evento particular
router.get('/eventos/detallesEvento/:id', async(req, res) => {
  const idEvento = req.params.id;

  try {
    const evento = await Evento.findOne({
      attributes: ['id', 'lugar', 'fecha', 'descripcion', 'enlace_pdf', 'enlace_entradas', 'tipo'],
      where: {
        id: {
          [Op.eq]: idEvento
        }
      }
    });
    console.log("Encontrado el evento: " + evento.toJSON());
    res.json(evento);
  }
  catch(error) {
    console.log("Error en la obtención de detalles del evento: " + error);
    res.status(500).json({error: 'Error en la obtención de detalles del evento: ' + error});
  }
});

router.post('/eventos/crearEvento', async(req, res) => {
  const {lugar, fecha, descripcion, enlace_pdf, enlace_entradas, tipo} = req.body;

  try {
    var nuevoEvento = await Evento.create({
      lugar,
      fecha,
      descripcion,
      enlace_pdf,
      enlace_entradas,
      tipo
    });

    if (!nuevoEvento) {
      return res.status(400).json({ message: 'No se pudo crear el evento' });
    }

    res.status(201).json({
      message: 'Evento creado con éxito',
      evento: nuevoEvento
    });
  }
  catch(error){
    console.error('Error al crear el evento:', error);
    res.status(500).json({
        message: 'Error al crear el evento',
        error: error.message
    });
  }
});

router.put('/eventos/actualizarEvento/:id', async(req, res) => {
  const idEvento = req.params.id;
  const {lugar, fecha, descripcion, enlace_pdf, enlace_entradas, tipo} = req.body;

  try {
    var evento = await Evento.findByPk(idEvento);

    const eventoActualizado = await evento.update(
      {
        lugar,
        fecha,
        descripcion,
        enlace_pdf,
        enlace_entradas,
        tipo
      }
    );

    if (!eventoActualizado) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    res.status(200).json({
        message: 'Evento actualizado con éxito',
        evento: eventoActualizado
    });
  }
  catch(error){
    console.error('Error al actualizar el evento:', error);
    res.status(500).json({
        message: 'Error al actualizar el evento',
        error: error.message
    });
  }
});

router.delete('/eventos/eliminarEvento/:id', async(req, res) => {
  const idEvento = req.params.id;
  console.log("API: en eliminarEvento");
  try {
    var filasAfectadas = await Evento.destroy({
      where: {
        id: {
          [Op.eq]: idEvento
        }
      }
    });

    
    if (filasAfectadas > 0) {
      console.log("Borrado con éxito. Filas afectadas: " + filasAfectadas);
    }
    else {
      console.log("No habían objetos para borrar");
    }

    return res.status(200).json({message: "Borrado con éxito. Filas afectadas: " + filasAfectadas});
  } catch(error) {
    console.error("Error al borrar el evento");
    return res.status(500).json({message: "No habían objetos para borrar"});
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
      attributes: ['id', 'lugar', 'createdAt', 'descripcion'],
      where: {
        createdAt: {
          [Op.lt]: new Date() // Filtra eventos cuya fecha sea menor que la actual
        }
      },
      include: [
        {
          model: Multimedia,
          required: true
        }
      ],
      order: [['createdAt', 'ASC']],
      logging: console.log
    });

    res.json(eventos);
  } catch(error) {
    console.error('Error al obtener los eventos:', error);
    res.status(500).json({ error: 'Error al obtener los eventos' });
  }
});

router.post('/multimedia/crearMultimedia', async (req, res) => {
  const { id_evento, enlace_contenido, descripcion } = req.body;

  try {
    const nuevoMultimedia = await Multimedia.create({
      id_evento,
      enlace_contenido,
      descripcion
    });

    res.status(201).json(nuevoMultimedia);
  } catch (error) {
    console.error('Error al crear el contenido multimedia: ', error);
    res.status(500).json({ error: 'Error al crear el contenido multimedia' });
  }
});

router.put('/multimedia/editarMultimedia/:id', async (req, res) => {
  const idMultimedia = req.params.id;
  const { id_evento, enlace_contenido, descripcion } = req.body;

  try {
    const multimedia = await Multimedia.findByPk(idMultimedia);

    if (!multimedia) {
      return res.status(404).json({ message: 'Multimedia no encontrado' });
    }

    multimedia.id_evento = id_evento;
    multimedia.enlace_contenido = enlace_contenido;
    multimedia.descripcion = descripcion;

    await multimedia.save();

    res.status(200).json({ message: 'Multimedia actualizado con éxito', multimedia });
  } catch (error) {
    console.error('Error al actualizar el contenido multimedia: ', error);
    res.status(500).json({ message: 'Error al actualizar el contenido multimedia', error: error.message });
  }
});

router.delete('/multimedia/eliminarMultimedia/:id', async (req, res) => {
  const idMultimedia = req.params.id;

  try {
    const filasAfectadas = await Multimedia.destroy({
      where: {
        id: idMultimedia
      }
    });

    if (filasAfectadas > 0) {
      return res.status(200).json({ message: 'Multimedia eliminado con éxito' });
    } else {
      return res.status(404).json({ message: 'Multimedia no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar el contenido multimedia:', error);
    res.status(500).json({ message: 'Error al eliminar el contenido multimedia', error: error.message });
  }
});

router.get('/multimedia/getMultimediaById/:id', async (req, res) => {
  try {
    const multimedia = await Multimedia.findByPk(req.params.id);
    res.json(multimedia);
  } catch(error) {
    console.error('Error al obtener el multimedia:', error);
    res.status(500).json({ error: 'Error al obtener el multimedia' });
  }
});

router.get('/multimedia/getMultimediaByEvento/:id', async (req, res) => {
  try {
    const multimedia = await Multimedia.findAll({
      attributes: ['id', 'id_evento', 'enlace_contenido', 'descripcion'],
      where: {
        id_evento: {
          [Op.eq]: req.params.id
        }
      },
      order: [['id', 'ASC']],
      logging: console.log
    });

    res.json(multimedia);
  } catch(error) {
    console.error('Error al obtener el multimedia:', error);
    res.status(500).json({ error: 'Error al obtener el multimedia' });
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
    const articulos = await ArticuloBlog.count();
    console.log("Count de artículos: " + articulos);
    res.json(articulos);
  } catch(error) {
    console.error('Error al obtener los blogs: ', error);
    res.status(500).json({ error: 'Error al obtener los blogs: ' + error});
  }
});

router.get('/blog/articulosPagina/:page', async (req, res) => {
  try {
    const page = req.params.page;
    const limit = 5;
    const offset = (page - 1) * limit;
    const { filtro } = req.query
    const whereCondition = filtro
      ? {
          [Op.or]: [
            { titulo: { [Op.like]: `%${filtro}%` } },
            { contenido: { [Op.like]: `%${filtro}%` } },
            { autor: { [Op.like]: `%${filtro}%` } },
            { tags: { [Op.like]: `%${filtro}%` } }
          ]
        }
      : {}; // Si no hay filtro, no aplica condiciones

    const articulos = await ArticuloBlog.findAll({
      attributes: ['id', 'titulo', 'contenido', 'autor', 'fecha_publicacion', 'url_imagen', 'tags'],
      where: whereCondition,
      order: [['fecha_publicacion', 'ASC']],
      limit: limit,
      offset: offset,
      logging: console.log
    });

    const totalArticulos = await ArticuloBlog.count({
      where: whereCondition,
      logging: console.log
    });
    res.json({articulos: articulos, total: totalArticulos});
  } catch(error) {
    console.error('Error al obtener los blogs: ', error);
    res.status(500).json({ error: 'Error al obtener los blogs: ' + error});
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

router.post('/blog/articulos/create', async (req, res) => {
  const { titulo, contenido, autor, fecha_publicacion, url_imagen, tags } = req.body;

  try {
    const nuevoArticulo = await ArticuloBlog.create({
      titulo,
      contenido,
      autor,
      fecha_publicacion,
      url_imagen,
      tags
    });

    res.status(201).json(nuevoArticulo);
  } catch (error) {
    console.error('Error al crear el artículo de blog: ', error);
    res.status(500).json({ error: 'Error al crear el artículo de blog' });
  }
});

router.put('/blog/articulos/actualizarArticulo/:id', async (req, res) => {
  const idArticulo = req.params.id;
  const { titulo, contenido, autor, fecha_publicacion, url_imagen, tags } = req.body;

  try {
    const articulo = await ArticuloBlog.findByPk(idArticulo);

    if (!articulo) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    articulo.titulo = titulo;
    articulo.contenido = contenido;
    articulo.autor = autor;
    articulo.fecha_publicacion = fecha_publicacion;
    articulo.url_imagen = url_imagen;
    articulo.tags = tags;

    await articulo.save();

    res.status(200).json({ message: 'Artículo actualizado con éxito', articulo });
  } catch (error) {
    console.error('Error al actualizar el artículo de blog: ', error);
    res.status(500).json({ message: 'Error al actualizar el artículo de blog', error: error.message });
  }
});

router.delete('/blog/articulos/eliminarArticulo/:id', async (req, res) => {
  const idArticulo = req.params.id;
  console.log("API: en eliminarArticulo");
  try {
    const filasAfectadas = await ArticuloBlog.destroy({
      where: {
        id: idArticulo
      }
    });

    if (filasAfectadas > 0) {
      console.log("Borrado con éxito. Filas afectadas: " + filasAfectadas);
      return res.status(200).json({ message: "Borrado con éxito. Filas afectadas: " + filasAfectadas });
    } else {
      console.log("No habían objetos para borrar");
      return res.status(404).json({ message: "No se encontró el artículo para borrar" });
    }
  } catch (error) {
    console.error('Error al eliminar el artículo de blog:', error);
    return res.status(500).json({ message: 'Error al eliminar el artículo de blog', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.error("Errores en la validación");
    return res.status(400).json({errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      where: {
      username: {
        [Op.eq]: username // Filtra eventos cuya fecha sea menor que la actual
      }
      }
    });

    if (!user) {
      console.error('No hay usuario');
      return res.status(401).json({error: 'Credenciales inválidas'});
    }

    // Comparar la contraseña proporcionada con la almacenada
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.error('No coinciden las contraseñas');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign({ id: user.id, username: user.username}, JWT_SECRET, {
      expiresIn: '1h'
    });

    console.log("Enviando token: " + token);
    res.status(200).json({ token });
  }
  catch(error) {
    console.error('Error al autenticar:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
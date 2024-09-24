const express = require('express');
const { Evento } = require('../models');
const router = express.Router();

// Define tus rutas aquí
router.get('/', (req, res) => {
  res.send('Hello World');
});

// Get eventos
router.get('/historialEventos', async (req, res) => {
  try {
    const eventos = await Evento.findAll({
      attributes: ['id', 'lugar', 'fecha', 'descripcion', 'enlace_entradas']
    });

    res.json(eventos);
  } catch (error) {
    console.error('Error al obtener los eventos:', error);
    res.status(500).json({ error: 'Error al obtener los proyectos' });
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
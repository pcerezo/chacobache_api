const express = require('express');
const { Evento, Multimedia, PreguntaRespuesta, ArticuloBlog, User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { Op, where } = require('sequelize'); // Importa operadores de Sequelize
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
const authenticateToken = require('../middleware/authenticated');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/adminMain', authenticateToken, async(req, res) => {
    

    res.json({message: "En adminMain"});
});

router.post('/crearEvento', authenticateToken, async(req, res) => {


    res.json({message: "En crearEvento"});
});

module.exports = router;
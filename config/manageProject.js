const readline = require('readline');
const { Evento, Multimedia, ArticuloBlog, PreguntaRespuesta } = require('../models');
const sequelize = require('../config/database');

// Crear una interfaz de readline para capturar inputs
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Función para capturar el input
const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

// Función para agregar un nuevo evento a la base de datos
const addEvento = async () => {
  const lugar = await askQuestion("Introduce el lugar del evento: ");
  const fecha = await askQuestion("Introduce la fecha del evento (YYYY-MM-DD): ");
  const descripcion = await askQuestion("Introduce la descripción del evento: ");
  const enlace_pdf = await askQuestion("Introduce el enlace al PDF del evento: ");
  const enlace_entradas = await askQuestion("Introduce el enlace a las entradas del evento: ");
  const tipo = await askQuestion("Introduce el tipo de evento (concierto/charla/individual): ");

  await Evento.create({
    lugar,
    fecha,
    descripcion,
    enlace_pdf,
    enlace_entradas,
    tipo
  });

  console.log("Evento agregado exitosamente.");
  rl.close();
};

// Función para agregar nuevo contenido multimedia
const addMultimedia = async () => {
  const id_evento = await askQuestion("Introduce el ID del evento al que pertenece el contenido multimedia: ");
  const enlace_contenido = await askQuestion("Introduce el enlace del contenido multimedia: ");
  const descripcion = await askQuestion("Introduce la descripción del contenido multimedia: ");

  await Multimedia.create({
    id_evento,
    enlace_contenido,
    descripcion
  });

  console.log("Multimedia agregado exitosamente.");
  rl.close();
};

// Función para agregar un nuevo artículo al blog
const addArticuloBlog = async () => {
  const titulo = await askQuestion("Introduce el título del artículo: ");
  const contenido = await askQuestion("Introduce el contenido del artículo: ");
  const autor = await askQuestion("Introduce el nombre del autor: ");
  const fecha_publicacion = await askQuestion("Introduce la fecha de publicación (YYYY-MM-DD): ");
  const tags = await askQuestion("Introduce los tags del artículo (separados por comas): ");
  const url_imagen = await askQuestion("URL imagen de portada: ");

  await ArticuloBlog.create({
    titulo,
    contenido,
    autor,
    fecha_publicacion,
    url_imagen,
    tags
  });
  

  console.log("Artículo del blog agregado exitosamente.");
  rl.close();
};

// Función para agregar una nueva pregunta-respuesta
const addPreguntaRespuesta = async () => {
  const asunto = await askQuestion("Introduce el asunto de la pregunta: ");
  const texto_pregunta = await askQuestion("Introduce el texto de la pregunta: ");
  const texto_respuesta = await askQuestion("Introduce el texto de la respuesta: ");
  const fecha_publicacion = await askQuestion("Introduce la fecha de publicación (YYYY-MM-DD): ");

  await PreguntaRespuesta.create({
    asunto,
    texto_pregunta,
    texto_respuesta,
    fecha_publicacion
  });

  console.log("Pregunta y respuesta agregada exitosamente.");
  rl.close();
};

// Función principal para seleccionar qué quieres agregar
const main = async () => {
  const choice = await askQuestion("¿Qué deseas agregar? (1: Evento, 2: Multimedia, 3: Artículo Blog, 4: Pregunta-Respuesta): ");

  switch (choice) {
    case '1':
      await addEvento();
      break;
    case '2':
      await addMultimedia();
      break;
    case '3':
      await addArticuloBlog();
      break;
    case '4':
      await addPreguntaRespuesta();
      break;
    default:
      console.log("Opción no válida.");
      rl.close();
  }
};

// Sincroniza la base de datos y ejecuta la función principal
sequelize.sync().then(() => {
  main();
}).catch((err) => {
  console.error("Error al sincronizar la base de datos:", err);
  rl.close();
});

-- MySQL dump 10.13  Distrib 8.0.39, for Win64 (x86_64)
--
-- Host: localhost    Database: chacobache_dev
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Articulo_Blogs`
--
USE `chacobache_dev`;

SET FOREIGN_KEY_CHECKS = 0;


DROP TABLE IF EXISTS `Articulo_Blogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Articulo_Blogs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) DEFAULT NULL,
  `contenido` text COLLATE utf8mb4_unicode_ci,
  `autor` varchar(255) DEFAULT NULL,
  `fecha_publicacion` datetime DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `url_imagen` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Articulo_Blogs`
--

LOCK TABLES `Articulo_Blogs` WRITE;
/*!40000 ALTER TABLE `Articulo_Blogs` DISABLE KEYS */;
INSERT INTO `Articulo_Blogs` VALUES (1,'MasterClass de perreo','Don Manuel \'Chache\' nos presentará su primer taller de perreo titulado \"El perreo hasta el suelo\".','Manuel Madrid','2024-11-02 23:00:00','perreo,masterclass,Manuel,Chache','2024-11-03 17:32:23','2024-11-03 17:32:23','/assets/profiles/chache_perfil.PNG'),(2,'¿Cómo se toca el güiro?','Carlos impartirá una charla en el instituto IES Los Neveros acerca de cuál es la técnica correcta para tocar el güiro. Contará con la historia detrás del instrumento, técnica adecuada y por último una situación práctica en la que el güiro sea el protagonista de una obra musical.','Carlos J. Ávila','2023-11-04 00:00:00','güiro,percusion,carlos,coba','2024-11-03 18:23:21','2024-11-03 18:23:21','https://www.woodbrass.com/es-es/images/woodbrass/GUIRO+LP+243.JPG'),(3,'Prueba','Probando aquí el contenido de un nuevo artículo. \n\n Aquí hay un párrafo. \n\n Y aquí tenemos otro buenísimo y magnífico párrafo para que todos ustedes lo gocen enormemente. Sin más, me despido de ustedes. Un abrazo muy grande.','Pableras','2024-11-11 23:00:00','prueba,Pableras,párrafos','2024-11-12 18:47:18','2024-11-12 18:47:18',''),(4,'Otra Prueba','Aquí voy a probar los párrafos de nuevo.\n\n Esto quiere decir que vamos a ver cómo maneja esta página los párrafos y si los detecta adecuadamente.\n\n Éste es el tercer párrafo que escribo.\n\n Y aquí escribo el último y cuarto párrafo.','Pableras','2024-11-12 00:00:00','pableras,parrafo,parrafos,prueba','2024-11-12 18:57:03','2024-11-12 18:57:03','');
/*!40000 ALTER TABLE `Articulo_Blogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eventos`
--

DROP TABLE IF EXISTS `Eventos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Eventos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lugar` varchar(255) NOT NULL,
  `fecha` datetime NOT NULL,
  `descripcion` text NOT NULL,
  `enlace_pdf` varchar(255) DEFAULT NULL,
  `enlace_entradas` varchar(255) DEFAULT NULL,
  `tipo` enum('concierto','charla') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventos`
--

LOCK TABLES `Eventos` WRITE;
/*!40000 ALTER TABLE `Eventos` DISABLE KEYS */;
INSERT INTO `Eventos` VALUES (1,'Casa de Carlos','2023-12-04 00:00:00','Fiesta Otaku','','https://www.tomaticket.es/es-es/entradas-kpop-party-a-coruna','concierto','2024-10-05 17:45:55','2024-10-05 17:45:55'),(2,'Charla sobre danza romana','2025-01-01 00:00:00','Charla sobre cómo bailaban los antiguos romanos acompañada de una gran demostración','','','charla','2024-10-05 17:47:09','2024-10-05 17:47:09');
/*!40000 ALTER TABLE `Eventos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Multimedia`
--

DROP TABLE IF EXISTS `Multimedia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Multimedia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_evento` int NOT NULL,
  `enlace_contenido` varchar(255) NOT NULL,
  `descripcion` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_evento` (`id_evento`),
  CONSTRAINT `Multimedia_ibfk_1` FOREIGN KEY (`id_evento`) REFERENCES `eventos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Multimedia`
--

LOCK TABLES `Multimedia` WRITE;
/*!40000 ALTER TABLE `Multimedia` DISABLE KEYS */;
INSERT INTO `Multimedia` VALUES (1,1,'https://pic.indomio.es/image/1402554517/m-c.jpg','','2024-10-05 17:48:26','2024-10-05 17:48:26'),(2,1,'https://huetorvega.ideal.es/fotos/HUETORVEGA-parque-canadina-columpios-repor.jpg','La Cañailla','2024-10-06 17:01:23','2024-10-06 17:01:23'),(3,1,'https://www.youtube.com/watch?v=KJ4779E2YqQ','Chacobache Ensemble','2024-10-06 17:08:02','2024-10-06 17:08:02');
/*!40000 ALTER TABLE `Multimedia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Pregunta_Respuesta`
--

DROP TABLE IF EXISTS `Pregunta_Respuesta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Pregunta_Respuesta` (
  `id` int NOT NULL AUTO_INCREMENT,
  `asunto` varchar(255) DEFAULT NULL,
  `texto_pregunta` text,
  `texto_respuesta` text,
  `fecha_publicacion` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Pregunta_Respuesta`
--

LOCK TABLES `Pregunta_Respuesta` WRITE;
/*!40000 ALTER TABLE `Pregunta_Respuesta` DISABLE KEYS */;
INSERT INTO `Pregunta_Respuesta` VALUES (1,'Tipos de música','¿Qué géneros musicales soléis tocar por lo general?','Tocamos un poco de todo, cualquier género que puedas encontrar en las grandes obras audiovisuales de cine, videojuegos, anime... y por supuesto no nos olvidamos de la música clásica.','2024-10-25 22:00:00','2024-10-26 18:00:59','2024-10-26 18:00:59'),(2,'Lugares','¿Dónde soléis tocar?','Allí donde nos llamen. Hacemos acuerdos con ayuntamientos, asociaciones o particulares. Si te interesa que toquemos en tu municipio no dudes en escribirnos!','2024-10-25 22:00:00','2024-10-26 18:13:09','2024-10-26 18:13:09');
/*!40000 ALTER TABLE `Pregunta_Respuesta` ENABLE KEYS */;
UNLOCK TABLES;

SET FOREIGN_KEY_CHECKS = 1;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-17 17:50:38

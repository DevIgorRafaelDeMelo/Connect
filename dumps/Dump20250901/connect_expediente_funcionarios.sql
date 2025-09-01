-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: connect
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `expediente_funcionarios`
--

DROP TABLE IF EXISTS `expediente_funcionarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expediente_funcionarios` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `FUNCIONARIO_ID` int NOT NULL,
  `DIA_SEMANA` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ATIVO` tinyint(1) DEFAULT '0',
  `INICIO` time DEFAULT NULL,
  `PAUSA_INICIO` time DEFAULT NULL,
  `PAUSA_FIM` time DEFAULT NULL,
  `FIM` time DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `FUNCIONARIO_ID` (`FUNCIONARIO_ID`),
  CONSTRAINT `expediente_funcionarios_ibfk_1` FOREIGN KEY (`FUNCIONARIO_ID`) REFERENCES `funcionarios` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expediente_funcionarios`
--

LOCK TABLES `expediente_funcionarios` WRITE;
/*!40000 ALTER TABLE `expediente_funcionarios` DISABLE KEYS */;
INSERT INTO `expediente_funcionarios` VALUES (16,1,'terca',0,NULL,NULL,NULL,NULL),(17,2,'terca',1,'11:53:00','13:53:00','14:53:00','15:53:00'),(18,2,'quarta',1,'13:03:00','13:03:00','14:03:00','15:03:00'),(19,2,'quinta',1,'16:04:00','12:07:00','12:06:00','14:04:00'),(20,1,'segunda',0,NULL,NULL,NULL,NULL),(21,4,'segunda',1,'13:37:00','14:37:00','16:37:00','17:37:00'),(22,9,'segunda',1,'16:12:00','17:13:00','18:13:00','19:13:00'),(23,9,'terca',0,NULL,NULL,NULL,NULL),(24,9,'quarta',0,NULL,NULL,NULL,NULL),(25,9,'quinta',0,NULL,NULL,NULL,NULL),(26,9,'sexta',0,NULL,NULL,NULL,NULL),(27,9,'sabado',0,NULL,NULL,NULL,NULL),(28,9,'domingo',0,NULL,NULL,NULL,NULL),(29,6,'segunda',1,'01:12:00','17:13:00','18:13:00','19:13:00'),(30,1,'quarta',0,NULL,NULL,NULL,NULL),(31,1,'quinta',0,NULL,NULL,NULL,NULL),(32,1,'sexta',0,NULL,NULL,NULL,NULL),(33,1,'sabado',0,NULL,NULL,NULL,NULL),(34,1,'domingo',0,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `expediente_funcionarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-01 16:32:24

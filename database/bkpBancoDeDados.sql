-- MySQL dump 10.13  Distrib 8.0.20, for Win64 (x86_64)
--
-- Host: localhost    Database: eventos_unievent
-- ------------------------------------------------------
-- Server version	8.0.20

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
-- Dumping data for table `tbl_assunto`
--

LOCK TABLES `tbl_assunto` WRITE;
/*!40000 ALTER TABLE `tbl_assunto` DISABLE KEYS */;
INSERT INTO `tbl_assunto` VALUES (1,'Tecnologia e Inovação'),(2,'Música e Artes'),(3,'Educação e Carreira'),(4,'Saúde e Bem-Estar'),(5,'Esportes e Lazer'),(6,'Gastronomia');
/*!40000 ALTER TABLE `tbl_assunto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `tbl_categoria`
--

LOCK TABLES `tbl_categoria` WRITE;
/*!40000 ALTER TABLE `tbl_categoria` DISABLE KEYS */;
INSERT INTO `tbl_categoria` VALUES (1,'Congressos e Seminários'),(2,'Shows e Festivais'),(3,'Workshops e Cursos'),(4,'Eventos Esportivos'),(5,'Feiras e Exposições');
/*!40000 ALTER TABLE `tbl_categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `tbl_cliente`
--

LOCK TABLES `tbl_cliente` WRITE;
/*!40000 ALTER TABLE `tbl_cliente` DISABLE KEYS */;
INSERT INTO `tbl_cliente` VALUES (1,'Ana Silva','ana.s@email.com','123456','11122233344',NULL,'11987654321','1990-05-15',NULL,1),(2,'Bruno Santos','bruno.s@email.com','123456','22233344455',NULL,'21998765432','1985-11-20',NULL,2),(3,'Carlos Souza','carlos.s@email.com','123456','33344455566',NULL,'31976543210','1995-03-01',NULL,2),(4,'Empresa A Marketing','empresa.a@email.com','123456',NULL,'12345678000190','41965432109',NULL,'2010-01-01',5),(5,'Diana Ferreira','diana.f@email.com','123456','44455566677',NULL,'51954321098','2000-08-25',NULL,1),(6,'Guilherme gonsolves','Gw0242333gmail.com','11c2e8b8aa8e5d79acb1b80bcc85218c71d699f0',NULL,'20.182.887/0701-49','11993679608',NULL,'1967-07-18',NULL),(7,'Guilherme gonsolves','leonardogmail.com','40bd001563085fc35165329ea1ff5c5ecbdbbeef',NULL,'20.182.287/0701-49','11993679608',NULL,'1967-07-18',NULL),(8,'Guilherme gonsolves','tfgfdggmail.com','40bd001563085fc35165329ea1ff5c5ecbdbbeef','333.444.555-66',NULL,'11993679608','1967-07-18',NULL,1),(9,'Sidney','sidneyc.aragaogmail.com','40bd001563085fc35165329ea1ff5c5ecbdbbeef','517.866.918-50',NULL,'11981096028','2008-07-02',NULL,2),(10,'Sidney','vitormgmail.com','40bd001563085fc35165329ea1ff5c5ecbdbbeef','547.866.918-50',NULL,'11981096028','2006-07-31',NULL,2);
/*!40000 ALTER TABLE `tbl_cliente` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_BI_cliente_validar_data_nascimento` BEFORE INSERT ON `tbl_cliente` FOR EACH ROW BEGIN
    IF NEW.data_fundacao IS NULL AND NEW.data_nascimento IS NOT NULL AND NEW.data_nascimento > CURDATE() THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'A data de nascimento não pode ser uma data futura.';
    END IF;
    
    IF NEW.data_fundacao IS NULL AND NEW.cpf IS NULL AND NEW.data_nascimento IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Para pessoa física, é necessário informar CPF ou Data de Nascimento.';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Dumping data for table `tbl_cliente_evento`
--

LOCK TABLES `tbl_cliente_evento` WRITE;
/*!40000 ALTER TABLE `tbl_cliente_evento` DISABLE KEYS */;
INSERT INTO `tbl_cliente_evento` VALUES (1,'2025-11-01 10:00:00',1,1),(2,'2025-11-05 11:30:00',2,2),(3,'2025-11-10 14:00:00',3,3),(4,'2025-11-15 16:30:00',4,4),(5,'2025-11-20 09:00:00',5,5),(6,'2025-12-15 14:56:36',1,23);
/*!40000 ALTER TABLE `tbl_cliente_evento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `tbl_endereco`
--

LOCK TABLES `tbl_endereco` WRITE;
/*!40000 ALTER TABLE `tbl_endereco` DISABLE KEYS */;
INSERT INTO `tbl_endereco` VALUES (1,'01001000','Av. Paulista','Próximo ao metrô','1500','Bela Vista','São Paulo',1,1),(2,'20040030','Rua da Assembleia','Sala 501','10','Centro','Rio de Janeiro',2,2),(3,'30112000','Av. Afonso Pena',NULL,'3300','Serra','Belo Horizonte',3,3),(4,'40020000','Praça da Sé','Ao lado da Catedral','S/N','Sé','Salvador',4,4),(5,'90010000','Rua dos Andradas','Edifício Comercial','123','Centro','Porto Alegre',5,5),(6,'01001000','Praça da Sé','Lado ímpar','100','Sé','São Paulo',2,21),(7,'01001000','Praça da Sé','Lado ímpar','100','Sé','São Paulo',2,22),(8,'01001000','Praça da Sé','Lado ímpar','100','Sé','São Paulo',2,23),(9,'69314124','Rua Acará-açu','fsdfuhuehwf','Santa Tereza','Santa Tereza','Boa Vista',1,48),(10,'01001000','Praça da Sé','Lado ímpar','100','Sé','São Paulo',2,51),(11,'01001000','Praça da Sé','Lado ímpar','100','Sé','São Paulo',2,55),(12,'01001000','Praça da Sé','Lado ímpar','100','Sé','São Paulo',2,56);
/*!40000 ALTER TABLE `tbl_endereco` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `tbl_estado`
--

LOCK TABLES `tbl_estado` WRITE;
/*!40000 ALTER TABLE `tbl_estado` DISABLE KEYS */;
INSERT INTO `tbl_estado` VALUES (1,'SP'),(2,'RJ'),(3,'MG'),(4,'BA'),(5,'RS');
/*!40000 ALTER TABLE `tbl_estado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `tbl_evento`
--

LOCK TABLES `tbl_evento` WRITE;
/*!40000 ALTER TABLE `tbl_evento` DISABLE KEYS */;
INSERT INTO `tbl_evento` VALUES (1,'Tech Summit São Paulo 2024','O maior evento de inovação e desenvolvimento de software da região.','2024-11-20','09:00:00','2024-11-22','18:00:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/17658152008331765787217401-535656804-EVENTO.png',500,80,1,1,1),(2,'Festival de Rock','Três dias de rock e música alternativa.','2026-07-20','16:00:00','2026-07-22','23:00:00','banner_rock.jpg',10000,502,1,2,2),(3,'Curso de Liderança','Desenvolva suas habilidades de gestão.','2026-04-05','08:30:00','2026-04-05','17:30:00','banner_curso.jpg',50,5,1,3,3),(4,'Maratona da Cidade','Corrida de rua anual.','2026-05-01','07:00:00','2026-05-01','12:00:00','banner_maratona.jpg',2000,153,1,4,5),(5,'Feira de Sustentabilidade','Exposição de produtos e serviços ecológicos.','2026-06-15','10:00:00','2026-06-18','20:00:00','banner_sustentavel.jpg',3000,105,0,5,4),(6,'Tech Summit São Paulo 2024','O maior evento de inovação e desenvolvimento de software da região.','2024-11-20','09:00:00','2024-11-22','18:00:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/1765814988436istockphoto-597674042-612x612.jpg',500,0,1,4,1),(7,'Tech Summit São Paulo 2024','O maior evento de inovação e desenvolvimento de software da região.','2024-11-20','09:00:00','2024-11-22','18:00:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/1765815044733istockphoto-597674042-612x612.jpg',500,0,1,4,1),(8,'BALINHA GAMES','o melhor de todos','2025-12-15','13:30:00','2028-12-20','17:00:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/17658162820711765789580586-321419047-MINHA CONTA.png',10,0,1,1,3),(9,'Pedro shows','bala dms','2025-12-15','13:45:00','2026-01-15','16:50:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/17658164593601765787937270-692966996-EVENTO.png',205,0,1,1,2),(10,'bala 3','adda','2026-04-13','21:04:00','2029-02-05','04:21:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/17658165938581765814988431-884338686-istockphoto-597674042-612x612.jpg',205,0,1,2,1),(11,'5252523523','r234r235235r','2028-02-20','15:44:00','2045-12-14','14:04:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/17658167304261765788300809-765036915-EVENTO.png',205,0,1,2,3),(12,'yoprew','wqrfqwfwq','2025-05-23','14:41:00','2027-05-14','05:59:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/17658169230871765789750792-248369333-EVENTO.png',205,0,1,1,3),(13,'23523523523','23523523523','2026-05-23','12:41:00','2027-04-21','04:12:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/17658170290951765814988431-884338686-istockphoto-597674042-612x612.jpg',205,0,1,1,2),(14,'5536436','4364362462','2025-05-31','14:12:00','2028-02-23','23:03:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/17658172501911765788509020-158654758-EVENTO (2).png',205,0,1,2,3),(15,'32325325','235235235','2025-02-25','12:04:00','2029-04-14','03:42:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/17658173929961765814988431-884338686-istockphoto-597674042-612x612.jpg',205,0,1,1,3),(16,'235235','23523523523','2027-02-24','23:03:00','2029-02-24','04:23:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/17658175988421765817250179-401928403-1765788509020-158654758-EVENTO (2).png',205,0,1,1,3),(17,'523523','5234523524352543','2027-05-31','04:13:00','2029-04-21','23:05:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/17658179796771765789750792-248369333-EVENTO.png',205,0,1,1,3),(18,'4235235','2435243534','2026-05-23','23:05:00','2027-02-23','23:35:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/17658182002401765814988431-884338686-istockphoto-597674042-612x612.jpg',205,0,1,1,3),(19,'23523523','5235235235','2026-05-31','04:32:00','2027-04-24','04:34:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/17658187756931765789909220-514080634-EVENTO (2).png',205,0,1,1,3),(20,'43543tretgre','43543tf','2026-02-20','03:24:00','2028-02-24','04:23:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/17658188705681765788509020-158654758-EVENTO (2).png',205,0,1,1,2),(21,'24352435235','45r4tgiretugr8e','2026-02-20','23:24:00','2027-02-24','04:21:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/17658189332471765814988431-884338686-istockphoto-597674042-612x612.jpg',205,0,1,1,2),(22,'Tech Summit São Paulo 2024','O maior evento de inovação e desenvolvimento de software da região.','2024-11-20','09:00:00','2024-11-22','18:00:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/17658199343021765819759911-295630005-1765817392991-339278468-1765814988431-884338686-istockphoto-597674042-612x612.jpg',500,0,1,4,1),(23,'TOP Summit São Paulo 2024','O maior evento de inovação e desenvolvimento de software da região.','2024-11-20','09:00:00','2024-11-22','18:00:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/1765821395867Evento-Corporativo.jpg',500,0,1,1,1),(24,'TOP Summit São Paulo 2024','O maior evento de inovação e desenvolvimento de software da região.','2024-11-20','09:00:00','2024-11-22','18:00:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/1765822527303Evento-Corporativo.jpg',500,0,1,4,1),(25,'TOP Summit São Paulo 2024','O maior evento de inovação e desenvolvimento de software da região.','2024-11-20','09:00:00','2024-11-22','18:00:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/1765822723743Evento-Corporativo.jpg',500,0,1,4,1),(26,'TOP Summit São Paulo 2024','O maior evento de inovação e desenvolvimento de software da região.','2024-11-20','09:00:00','2024-11-22','18:00:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/1765822774973Evento-Corporativo.jpg',500,0,1,4,1),(27,'TOP Summit São Paulo 2024','O maior evento de inovação e desenvolvimento de software da região.','2024-11-20','09:00:00','2024-11-22','18:00:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/1765822804474Evento-Corporativo.jpg',500,0,1,4,1),(28,'TOP Summit São Paulo 2024','O maior evento de inovação e desenvolvimento de software da região.','2024-11-20','09:00:00','2024-11-22','18:00:00','https://toquesenaistorage.blob.core.windows.net/tgsenai/1765823039404Evento-Corporativo.jpg',500,0,1,4,1),(29,'TOP Summit São Paulo 2024','O maior evento de inovação e desenvolvimento de software da região.','2024-11-20','09:00:00','2024-11-22','18:00:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/1765823320283Evento-Corporativo.jpg',500,0,1,4,1),(30,'TOP Summit São Paulo 2024','O maior evento de inovação e desenvolvimento de software da região.','2024-11-20','09:00:00','2024-11-22','18:00:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/1765823592036pngtree-abstract-cloudy-background-beautiful-natural-streaks-of-sky-and-clouds-red-image_15684333.jpg',500,0,1,4,1),(31,'TOP Summit São Paulo 2024','O maior evento de inovação e desenvolvimento de software da região.','2024-11-20','09:00:00','2024-11-22','18:00:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/1765823759354pngtree-abstract-cloudy-background-beautiful-natural-streaks-of-sky-and-clouds-red-image_15684333.jpg',500,0,1,4,1),(32,'TOP Summit São Paulo 2024','O maior evento de inovação e desenvolvimento de software da região.','2024-11-20','09:00:00','2024-11-22','18:00:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/1765823890244pngtree-abstract-cloudy-background-beautiful-natural-streaks-of-sky-and-clouds-red-image_15684333.jpg',500,0,1,4,1),(33,'TOP Summit São Paulo 2024','O maior evento de inovação e desenvolvimento de software da região.','2024-11-20','09:00:00','2024-11-22','18:00:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/1765824116309pngtree-abstract-cloudy-background-beautiful-natural-streaks-of-sky-and-clouds-red-image_15684333.jpg',500,0,1,4,1),(34,'TOP Summit São Paulo 2024','O maior evento de inovação e desenvolvimento de software da região.','2024-11-20','09:00:00','2024-11-22','18:00:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/1765824505400pngtree-abstract-cloudy-background-beautiful-natural-streaks-of-sky-and-clouds-red-image_15684333.jpg',500,0,1,4,1),(35,'fsdfsfsfsfsa','efedfsdfsdc32vr3','2022-02-20','12:43:00','2025-02-24','21:04:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/17658250302171765824505400pngtree-abstract-cloudy-background-beautiful-natural-streaks-of-sky-and-clouds-red-image_15684333.jpg',205,0,1,1,3),(36,'fsdfsfsfsfsa','fsafssdsdf','2025-02-02','03:52:00','2027-05-31','04:23:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/17658253290301765824505400pngtree-abstract-cloudy-background-beautiful-natural-streaks-of-sky-and-clouds-red-image_15684333.jpg',205,0,1,1,3),(37,'fsdfsfsfsfsa','45t43t43t43','2026-05-23','04:02:00','2028-05-24','04:35:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/17658255416951765824505400pngtree-abstract-cloudy-background-beautiful-natural-streaks-of-sky-and-clouds-red-image_15684333.jpg',205,0,1,2,3),(38,'fsdfsfsfsfsa','3fdgerege','2026-02-04','04:25:00','2028-05-24','04:25:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/17658256286641765824505400pngtree-abstract-cloudy-background-beautiful-natural-streaks-of-sky-and-clouds-red-image_15684333.jpg',205,0,1,2,3),(39,'fsdfsfsfsfsa','435t43t3t34','2026-02-24','03:25:00','2028-02-24','03:25:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/17658257753841765824505400pngtree-abstract-cloudy-background-beautiful-natural-streaks-of-sky-and-clouds-red-image_15684333.jpg',205,0,1,3,2),(40,'fsdfsfsfsfsa','sfsdf','2026-03-31','03:25:00','2027-05-23','04:35:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/17658260078891765824505400pngtree-abstract-cloudy-background-beautiful-natural-streaks-of-sky-and-clouds-red-image_15684333.jpg',205,0,1,2,3),(41,'fsdfsfsfsfsa','sfsdf','2026-03-31','03:25:00','2027-05-23','04:35:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/17658260254641765824505400pngtree-abstract-cloudy-background-beautiful-natural-streaks-of-sky-and-clouds-red-image_15684333.jpg',205,0,1,2,3),(42,'fsdfsfsfsfsa','sfsdf','2026-03-31','03:25:00','2027-05-23','04:35:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/17658260258461765824505400pngtree-abstract-cloudy-background-beautiful-natural-streaks-of-sky-and-clouds-red-image_15684333.jpg',205,0,1,2,3),(43,'fsdfsfsfsfsa','sfsdf','2026-03-31','03:25:00','2027-05-23','04:35:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/17658260261261765824505400pngtree-abstract-cloudy-background-beautiful-natural-streaks-of-sky-and-clouds-red-image_15684333.jpg',205,0,1,2,3),(44,'fsdfsfsfsfsa','23r243t24t2','2025-02-24','04:13:00','2026-04-25','23:23:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/17658261111411765824505400pngtree-abstract-cloudy-background-beautiful-natural-streaks-of-sky-and-clouds-red-image_15684333.jpg',205,0,1,3,1),(45,'fsdfsfsfsfsa','tsdgdgsdg','2025-02-24','23:23:00','2026-02-24','23:05:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/17658262424411765824505400pngtree-abstract-cloudy-background-beautiful-natural-streaks-of-sky-and-clouds-red-image_15684333.jpg',205,0,1,1,3),(46,'fsdfsfsfsfsa','rqrwer32','2026-02-04','21:04:00','2027-05-24','23:06:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/17658264419451765824505400pngtree-abstract-cloudy-background-beautiful-natural-streaks-of-sky-and-clouds-red-image_15684333.jpg',205,0,1,3,1),(47,'fsdfsfsfsfsa','43t43t43','2025-02-24','23:05:00','2026-02-25','23:05:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/17658265251451765824505400pngtree-abstract-cloudy-background-beautiful-natural-streaks-of-sky-and-clouds-red-image_15684333.jpg',205,0,1,1,3),(48,'fsdfsfsfsfsa','325423523523','2026-02-24','23:05:00','2028-02-25','23:35:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/17658268261391765824505400pngtree-abstract-cloudy-background-beautiful-natural-streaks-of-sky-and-clouds-red-image_15684333.jpg',205,60,1,1,3),(49,'Criado Evento','evento treterter','2025-12-20','23:04:00','2026-02-24','23:05:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/1765827041543pngtree-abstract-cloudy-background-beautiful-natural-streaks-of-sky-and-clouds-red-image_15684333.jpg',10,10,1,1,2),(50,'Criado Evento','evento treterter','2025-12-20','23:04:00','2026-02-24','23:05:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/1765827048606pngtree-abstract-cloudy-background-beautiful-natural-streaks-of-sky-and-clouds-red-image_15684333.jpg',10,0,1,1,2),(51,'Meu evento legal','legal','2025-04-13','21:04:00','2027-10-24','21:04:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/17659059294581765824505400pngtree-abstract-cloudy-background-beautiful-natural-streaks-of-sky-and-clouds-red-image_15684333.jpg',10,0,1,3,3),(52,'Meu evento legal','5grfgreg','2025-04-24','21:04:00','2056-04-21','21:04:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/17659095345381765824505400pngtree-abstract-cloudy-background-beautiful-natural-streaks-of-sky-and-clouds-red-image_15684333.jpg',10,0,1,5,2),(53,'Meu evento legal','jjkjjkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkjjkjjkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkjjkjjkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkjjkjjkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkjjkjjkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk','2023-07-06','07:08:00','2024-07-06','06:59:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/1765910662047pngtree-abstract-cloudy-background-beautiful-natural-streaks-of-sky-and-clouds-red-image_15684333.jpg',200,40,1,2,1),(54,'Meu evento legal','gdfgfdg','2025-04-05','21:04:00','2047-04-21','23:05:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/1765910908920pngtree-abstract-cloudy-background-beautiful-natural-streaks-of-sky-and-clouds-red-image_15684333.jpg',200,0,1,4,1),(55,'Meu evento legal','ghuihuh','2020-07-09','08:59:00','2023-08-09','08:59:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/17659120350881765824505400pngtree-abstract-cloudy-background-beautiful-natural-streaks-of-sky-and-clouds-red-image_15684333.jpg',200,20,1,5,1),(56,'Meu evento legal -jj','ugugug','2025-12-16','16:13:00','2025-12-16','20:00:00','https://nuvemsenai.blob.core.windows.net/uploudimagens/17659124132801765824505400pngtree-abstract-cloudy-background-beautiful-natural-streaks-of-sky-and-clouds-red-image_15684333.jpg',200,0,1,4,1);
/*!40000 ALTER TABLE `tbl_evento` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_BI_evento_validar_data_fim` BEFORE INSERT ON `tbl_evento` FOR EACH ROW BEGIN
    IF TIMESTAMP(NEW.data_inicio, NEW.hora_inicio) >= TIMESTAMP(NEW.data_termino, NEW.hora_termino) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'A data/hora de término do evento deve ser posterior à data/hora de início.';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Dumping data for table `tbl_genero`
--

LOCK TABLES `tbl_genero` WRITE;
/*!40000 ALTER TABLE `tbl_genero` DISABLE KEYS */;
INSERT INTO `tbl_genero` VALUES (1,'Feminino'),(2,'Masculino'),(3,'Não Binário'),(4,'Outro'),(5,'Não Informado');
/*!40000 ALTER TABLE `tbl_genero` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `tbl_ingresso`
--

LOCK TABLES `tbl_ingresso` WRITE;
/*!40000 ALTER TABLE `tbl_ingresso` DISABLE KEYS */;
INSERT INTO `tbl_ingresso` VALUES (1,'Passaporte 3 dias',999.00,1,1),(2,'Dia 1',399.00,1,1),(3,'Acesso Workshop',150.00,1,2),(4,'Pista Comum',80.00,1,2),(5,'VIP',300.00,1,2),(6,'Acesso Geral',45.00,1,4),(7,'Pacote 3 Dias',450.00,1,1),(8,'Entrada Simples',15.00,1,5),(9,'Passaporte 12 dias',28.13,1,1),(10,'Balas media',9.70,1,48),(11,'Ingresso Medio',485.00,1,49),(12,'Ingresso Medio',485.00,1,50),(13,'Passaporte 12 dias',28.13,1,51),(14,'Ingresso Médio',9.70,1,53),(15,'Ingresso Médio',9.70,1,53),(16,'Ingresso Médio',9.70,1,55);
/*!40000 ALTER TABLE `tbl_ingresso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `tbl_item_pedido`
--

LOCK TABLES `tbl_item_pedido` WRITE;
/*!40000 ALTER TABLE `tbl_item_pedido` DISABLE KEYS */;
INSERT INTO `tbl_item_pedido` VALUES (1,2,1,7),(2,1,2,4),(3,3,3,6),(4,1,4,5),(5,5,5,8),(6,20,8,1),(7,20,10,7),(8,20,11,9),(9,20,12,10),(10,20,42,1),(11,20,43,10),(12,20,45,10),(13,10,45,11),(15,20,50,14),(16,20,51,15),(17,20,52,16);
/*!40000 ALTER TABLE `tbl_item_pedido` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_BI_item_pedido_validar_quantidade_estoque` BEFORE INSERT ON `tbl_item_pedido` FOR EACH ROW BEGIN
    DECLARE total_disponivel INT;
    DECLARE ingressos_comprados INT;
    DECLARE evento_id_do_ingresso INT;

    IF NEW.quantidade <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'A quantidade do item deve ser maior que zero.';
    END IF;

    SELECT id_evento INTO evento_id_do_ingresso FROM tbl_ingresso WHERE id_ingresso = NEW.id_ingresso;
    
    SELECT quantidade_ingresso, quantidade_ingresso_comprado
    INTO total_disponivel, ingressos_comprados
    FROM tbl_evento
    WHERE id_evento = evento_id_do_ingresso;

    IF ingressos_comprados + NEW.quantidade > total_disponivel THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Estoque insuficiente para a quantidade solicitada.';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_AI_item_pedido_calcular_total_pedido` AFTER INSERT ON `tbl_item_pedido` FOR EACH ROW BEGIN
    UPDATE tbl_pedido p
    SET p.valor_total = (
        SELECT IFNULL(SUM(ip.quantidade * i.preco_unitario), 0)
        FROM tbl_item_pedido ip
        JOIN tbl_ingresso i ON ip.id_ingresso = i.id_ingresso
        WHERE ip.id_pedido = NEW.id_pedido
    )
    WHERE p.id_pedido = NEW.id_pedido;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_AI_item_pedido_atualizar_estoque` AFTER INSERT ON `tbl_item_pedido` FOR EACH ROW BEGIN
    UPDATE tbl_evento e
    JOIN tbl_ingresso i ON e.id_evento = i.id_evento
    SET e.quantidade_ingresso_comprado = e.quantidade_ingresso_comprado + NEW.quantidade
    WHERE i.id_ingresso = NEW.id_ingresso;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_AU_item_pedido_calcular_total_pedido` AFTER UPDATE ON `tbl_item_pedido` FOR EACH ROW BEGIN
    UPDATE tbl_pedido p
    SET p.valor_total = (
        SELECT IFNULL(SUM(ip.quantidade * i.preco_unitario), 0)
        FROM tbl_item_pedido ip
        JOIN tbl_ingresso i ON ip.id_ingresso = i.id_ingresso
        WHERE ip.id_pedido = NEW.id_pedido
    )
    WHERE p.id_pedido = NEW.id_pedido;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_AD_item_pedido_calcular_total_pedido` AFTER DELETE ON `tbl_item_pedido` FOR EACH ROW BEGIN
    UPDATE tbl_pedido p
    SET p.valor_total = (
        SELECT IFNULL(SUM(ip.quantidade * i.preco_unitario), 0)
        FROM tbl_item_pedido ip
        JOIN tbl_ingresso i ON ip.id_ingresso = i.id_ingresso
        WHERE ip.id_pedido = OLD.id_pedido
    )
    WHERE p.id_pedido = OLD.id_pedido;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Dumping data for table `tbl_organizador`
--

LOCK TABLES `tbl_organizador` WRITE;
/*!40000 ALTER TABLE `tbl_organizador` DISABLE KEYS */;
INSERT INTO `tbl_organizador` VALUES (1,'Eventos Prime Ltda','prime@eventos.com','123456',NULL,'00011122233344','1155551234',NULL,'2015-07-10',5),(2,'Gerson Rodrigues','gerson@organiza.com','123456','55566677788',NULL,'2155555678','1978-04-12',NULL,2),(3,'União Cultural','cultura@uniaoc.com','123456',NULL,'11100033344455','3155559012',NULL,'2005-02-28',5),(4,'Helena Costa','helena@eventos.net','123456','66677788899',NULL,'4155553456','1992-09-03',NULL,1),(5,'TechMasters Co','tech@masters.com','123456',NULL,'22211144455566','5155557890',NULL,'2018-11-11',5),(6,'Eduardo Games','sidneyc.aragaogmail.com','40bd001563085fc35165329ea1ff5c5ecbdbbeef',NULL,'22.211.144/4555-66','11981096028',NULL,'2004-03-13',NULL),(7,'empresa x','vitormgmail.com','40bd001563085fc35165329ea1ff5c5ecbdbbeef',NULL,'22.211.144/4955-66','11881096028',NULL,'2005-05-05',NULL);
/*!40000 ALTER TABLE `tbl_organizador` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `tbl_organizador_evento`
--

LOCK TABLES `tbl_organizador_evento` WRITE;
/*!40000 ALTER TABLE `tbl_organizador_evento` DISABLE KEYS */;
INSERT INTO `tbl_organizador_evento` VALUES (1,'2025-10-01',1,1),(2,'2025-10-05',2,2),(3,'2025-10-10',3,3),(4,'2025-10-15',4,4),(5,'2025-10-20',5,5),(6,'2025-12-15',1,23);
/*!40000 ALTER TABLE `tbl_organizador_evento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `tbl_pedido`
--

LOCK TABLES `tbl_pedido` WRITE;
/*!40000 ALTER TABLE `tbl_pedido` DISABLE KEYS */;
INSERT INTO `tbl_pedido` VALUES (1,'2025-11-28','FINALIZADO',900.00,1,1),(2,'2025-11-29','EM_ANDAMENTO',80.00,2,2),(3,'2025-11-30','CANCELADO',135.00,3,3),(4,'2025-12-01','FINALIZADO',300.00,4,4),(5,'2025-12-02','EM_ANDAMENTO',75.00,5,5),(6,'1967-07-18','FINALIZADO',0.00,1,6),(7,'1967-07-18','FINALIZADO',0.00,1,6),(8,'1967-07-18','FINALIZADO',19980.00,1,6),(9,'1967-07-18','FINALIZADO',0.00,1,6),(10,'1967-07-18','FINALIZADO',9000.00,1,6),(11,'1967-07-18','FINALIZADO',562.60,1,6),(12,'1967-07-18','FINALIZADO',194.00,1,6),(13,'1967-07-18','FINALIZADO',0.00,1,6),(14,'1967-07-18','FINALIZADO',0.00,1,6),(15,'1967-07-18','FINALIZADO',0.00,1,6),(16,'1967-07-18','FINALIZADO',0.00,1,6),(17,'1967-07-18','FINALIZADO',0.00,1,6),(18,'1967-07-18','FINALIZADO',0.00,1,6),(19,'1967-07-18','FINALIZADO',0.00,1,6),(20,'1967-07-18','FINALIZADO',0.00,1,6),(21,'1967-07-18','FINALIZADO',0.00,1,6),(22,'1967-07-18','FINALIZADO',0.00,1,6),(23,'1967-07-18','FINALIZADO',0.00,1,6),(24,'1967-07-18','FINALIZADO',0.00,1,6),(25,'1967-07-18','FINALIZADO',0.00,1,6),(26,'1967-07-18','FINALIZADO',0.00,1,6),(27,'1967-07-18','FINALIZADO',0.00,1,6),(28,'1967-07-18','FINALIZADO',0.00,1,6),(29,'1967-07-18','FINALIZADO',0.00,1,6),(30,'1967-07-18','FINALIZADO',0.00,1,6),(31,'1967-07-18','FINALIZADO',0.00,1,6),(32,'1967-07-18','FINALIZADO',0.00,1,6),(33,'1967-07-18','FINALIZADO',0.00,1,6),(34,'1967-07-18','FINALIZADO',0.00,1,6),(35,'1967-07-18','FINALIZADO',0.00,1,6),(36,'1967-07-18','FINALIZADO',0.00,1,6),(37,'1967-07-18','FINALIZADO',0.00,1,6),(38,'1967-07-18','FINALIZADO',0.00,1,6),(39,'1967-07-18','FINALIZADO',0.00,1,6),(40,'1967-07-18','FINALIZADO',0.00,1,6),(41,'1967-07-18','FINALIZADO',0.00,1,6),(42,'1967-07-18','FINALIZADO',19980.00,1,6),(43,'1967-07-18','FINALIZADO',194.00,1,6),(44,'1967-07-18','FINALIZADO',0.00,1,6),(45,'1967-07-18','FINALIZADO',5044.00,1,6),(46,'1967-07-18','FINALIZADO',0.00,1,6),(47,'1967-07-18','FINALIZADO',0.00,1,6),(48,'1967-07-18','FINALIZADO',0.00,1,6),(49,'2025-12-16','FINALIZADO',0.00,1,7),(50,'2025-12-16','FINALIZADO',194.00,1,7),(51,'2025-12-16','FINALIZADO',194.00,1,7),(52,'2025-12-16','FINALIZADO',194.00,1,6);
/*!40000 ALTER TABLE `tbl_pedido` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_BI_pedido_setar_valores_padrao` BEFORE INSERT ON `tbl_pedido` FOR EACH ROW BEGIN
    IF NEW.data_pedido IS NULL THEN
        SET NEW.data_pedido = NOW();
    END IF;
    
    IF NEW.status_pedido IS NULL THEN
        SET NEW.status_pedido = 'EM_ANDAMENTO';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_AU_pedido_cancelado_devolver_estoque` AFTER UPDATE ON `tbl_pedido` FOR EACH ROW BEGIN
    IF OLD.status_pedido <> 'CANCELADO' AND NEW.status_pedido = 'CANCELADO' THEN
        UPDATE tbl_evento e
        JOIN tbl_ingresso i ON e.id_evento = i.id_evento
        JOIN tbl_item_pedido ip ON i.id_ingresso = ip.id_ingresso
        SET e.quantidade_ingresso_comprado = e.quantidade_ingresso_comprado - ip.quantidade
        WHERE ip.id_pedido = NEW.id_pedido;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Dumping events for database 'eventos_unievent'
--

--
-- Dumping routines for database 'eventos_unievent'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-16 16:15:10

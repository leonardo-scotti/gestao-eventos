-- MySQL dump 10.13  Distrib 8.0.20, for Win64 (x86_64)
--
-- Host: localhost    Database: db_locadoura_filme_ds2t_25_2
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
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('f19256ab-c9c5-484d-9556-cedf72371f39','a6102d461d40500868163b0b6a1162098fa2869ecf69f1124ab2c0caa0c88f1b','2025-10-07 17:36:06.536','20251007173606_backup07102025',NULL,NULL,'2025-10-07 17:36:06.504',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl__filme_genero`
--

DROP TABLE IF EXISTS `tbl__filme_genero`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl__filme_genero` (
  `filme_genero_id` int NOT NULL AUTO_INCREMENT,
  `filme_id` int NOT NULL,
  `genero_id` int NOT NULL,
  PRIMARY KEY (`filme_genero_id`),
  KEY `FK_FILME_FILME_GENERO` (`filme_id`),
  KEY `FK_GENERO_FILME_GENERO` (`genero_id`),
  CONSTRAINT `FK_FILME_FILME_GENERO` FOREIGN KEY (`filme_id`) REFERENCES `tbl_filme` (`id`),
  CONSTRAINT `FK_GENERO_FILME_GENERO` FOREIGN KEY (`genero_id`) REFERENCES `tbl_genero` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl__filme_genero`
--

LOCK TABLES `tbl__filme_genero` WRITE;
/*!40000 ALTER TABLE `tbl__filme_genero` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl__filme_genero` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_ator`
--

DROP TABLE IF EXISTS `tbl_ator`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_ator` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) NOT NULL,
  `idade` decimal(4,1) NOT NULL,
  `data_nascimento` date NOT NULL,
  `data_falecimento` date DEFAULT NULL,
  `nacionalidade` varchar(15) DEFAULT NULL,
  `atuando` tinyint(1) NOT NULL,
  `estado_civil` varchar(40) DEFAULT NULL,
  `genero` varchar(70) NOT NULL,
  `altura` decimal(3,2) DEFAULT NULL,
  `biografia` text,
  `foto` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_ator`
--

LOCK TABLES `tbl_ator` WRITE;
/*!40000 ALTER TABLE `tbl_ator` DISABLE KEYS */;
INSERT INTO `tbl_ator` VALUES (1,'Adam Sandler',59.0,'1966-09-09',NULL,'Americana',1,'Casado','Masculino',1.77,'Adam Richard Sandler é um ator, comediante, produtor, roteirista, músico e dublador norte-americano, de origem judaica','https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.blogdehollywood.com.br%2Fstreaming%2F6-filmes-com-adam-sandler-pra-ver-com-seu-pai-na-netflix%2F&psig=AOvVaw3Odtgg5hqYRrA5Bh3h-EeM&ust=1761848186342000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCKiRmIyCypADFQAAAAAdAAAAABAE'),(2,'Kevin James',60.0,'1965-04-26',NULL,'Americana',1,'Casado','Masculino',1.73,'Kevin George Knipfing é um ator, comediante, roteirista e produtor americano, famoso por seu papel na série \'The King of Queens\' e por filmes de comédia com Adam Sandler.','https://upload.wikimedia.org/wikipedia/commons/e/e0/Kevin_James_2016.jpg'),(3,'Chris Rock',60.0,'1965-02-07',NULL,'Norte-americano',1,'Divorciado','Masculino',1.78,'Christopher Julius Rock III é um comediante, ator, roteirista e produtor norte-americano. Conhecido por seu trabalho como comediante stand-up e no \'Saturday Night Live\'.','https://upload.wikimedia.org/wikipedia/commons/b/b8/Chris_Rock_2022.jpg'),(4,'Will Smith',57.0,'1968-09-25',NULL,'Inglesa',1,'Casado','Masculino',1.88,'Willard Carroll Smith II é um ator, rapper e produtor de cinema estadunidense. Conhecido por seu trabalho nas indústrias cinematográfica e musical, seus prêmios incluem um Oscar, um Globo de Ouro, um BAFTA e quatro Grammy Awards','https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.adorocinema.com%2Fpersonalidades%2Fpersonalidade-19358%2F&psig=AOvVaw2DzAiV6cpfgK4op6d-Phnq&ust=1762363835780000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCMiZ4YWD2ZADFQAAAAAdAAAAABAE'),(6,'Tom Holland',29.0,'1996-01-06',NULL,'Inglesa',1,'Casado','Masculino',1.69,'Thomas Stanley Tom Holland é um ator, diretor e dublador britânico. Ganhou destaque no cinema no papel de Lucas Bennett no filme O Impossível e teve reconhecimento internacional ao interpretar Peter Parker / Homem-Aranha nos filmes do Universo Cinematográfico Marvel.','https://upload.wikimedia.org/wikipedia/commons/b/b5/Adam_Sandler_%2845680155022%29_%28cropped%29.jpg'),(8,'Tom Holleeeeee',29.0,'1996-01-06',NULL,'Inglesa',1,'Casado','Masculino',1.69,'Thomas Stanley Tom Holland é um ator, diretor e dublador britânico. Ganhou destaque no cinema no papel de Lucas Bennett no filme O Impossível e teve reconhecimento internacional ao interpretar Peter Parker / Homem-Aranha nos filmes do Universo Cinematográfico Marvel.','https://upload.wikimedia.org/wikipedia/commons/b/b5/Adam_Sandler_%2845680155022%29_%28cropped%29.jpg'),(9,'Tom Holleeeeee',29.0,'1996-01-06','2000-05-31','Inglesa',1,'Casado','Masculino',1.69,'Thomas Stanley Tom Holland é um ator, diretor e dublador britânico. Ganhou destaque no cinema no papel de Lucas Bennett no filme O Impossível e teve reconhecimento internacional ao interpretar Peter Parker / Homem-Aranha nos filmes do Universo Cinematográfico Marvel.','https://upload.wikimedia.org/wikipedia/commons/b/b5/Adam_Sandler_%2845680155022%29_%28cropped%29.jpg');
/*!40000 ALTER TABLE `tbl_ator` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_diretor`
--

DROP TABLE IF EXISTS `tbl_diretor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_diretor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) NOT NULL,
  `idade` decimal(4,1) NOT NULL,
  `data_nascimento` date NOT NULL,
  `data_falecimento` date DEFAULT NULL,
  `nacionalidade` varchar(15) DEFAULT NULL,
  `atuando` tinyint(1) NOT NULL,
  `estado_civil` varchar(40) DEFAULT NULL,
  `genero` varchar(70) NOT NULL,
  `biografia` text,
  `foto` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_diretor`
--

LOCK TABLES `tbl_diretor` WRITE;
/*!40000 ALTER TABLE `tbl_diretor` DISABLE KEYS */;
INSERT INTO `tbl_diretor` VALUES (2,'Neymar',50.0,'2008-05-31','2008-06-30','Brasileira',1,'Casado','Masculino','Neymar jogador de futebol do barsemlona','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSq-FoDF-DbpqB35H4BHxMHwzDeMYszGQIkgim1D-YNaolwhl_d3QYH_0-b9XdQ0OVdbmmzk8gJ-h4xb6UgJsWCJSSr3j_DKpQlML1TrjF&s=10'),(3,'Cristiano Ronaldo',50.0,'2008-05-31','2008-06-30','Brasileira',1,'Casado','Masculino','Neymar jogador de futebol do barsemlona','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSq-FoDF-DbpqB35H4BHxMHwzDeMYszGQIkgim1D-YNaolwhl_d3QYH_0-b9XdQ0OVdbmmzk8gJ-h4xb6UgJsWCJSSr3j_DKpQlML1TrjF&s=10'),(4,'Messi',50.0,'2008-05-31','2008-06-30','Brasileira',1,'Casado','Masculino','Neymar jogador de futebol do barsemlona','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSq-FoDF-DbpqB35H4BHxMHwzDeMYszGQIkgim1D-YNaolwhl_d3QYH_0-b9XdQ0OVdbmmzk8gJ-h4xb6UgJsWCJSSr3j_DKpQlML1TrjF&s=10'),(5,'Philippe Maia',50.0,'1975-07-12',NULL,'Brasileira',1,'Casado','Masculino','Philippe Benício Maia de Gusmão é ator, dublador, escritor, diretor de dublagem e youtuber brasileiro','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRc03s_37_ifdouFjcswRFEhnm7dYwSvGOpfi8QD0XTrI_b4UbxN2a7gsHhwinjCB12TzUoD8b3_RgVVTVJB30RUSxaKEEVQUiJyEq9WUGVyg&s=10');
/*!40000 ALTER TABLE `tbl_diretor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_dublador`
--

DROP TABLE IF EXISTS `tbl_dublador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_dublador` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) NOT NULL,
  `idade` decimal(4,1) NOT NULL,
  `data_nascimento` date NOT NULL,
  `data_falecimento` date DEFAULT NULL,
  `nacionalidade` varchar(15) DEFAULT NULL,
  `atuando` tinyint(1) NOT NULL,
  `estado_civil` varchar(40) DEFAULT NULL,
  `genero` varchar(70) NOT NULL,
  `biografia` text,
  `foto` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_dublador`
--

LOCK TABLES `tbl_dublador` WRITE;
/*!40000 ALTER TABLE `tbl_dublador` DISABLE KEYS */;
INSERT INTO `tbl_dublador` VALUES (1,'Philippe Maia',50.0,'1975-07-12',NULL,'Brasileira',1,'Casado','Masculino','Philippe Benício Maia de Gusmão é ator, dublador, escritor, diretor de dublagem e youtuber brasileiro','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRc03s_37_ifdouFjcswRFEhnm7dYwSvGOpfi8QD0XTrI_b4UbxN2a7gsHhwinjCB12TzUoD8b3_RgVVTVJB30RUSxaKEEVQUiJyEq9WUGVyg&s=10'),(2,'Messi',50.0,'2008-05-31','2008-06-30','Brasileira',1,'Casado','Masculino','Neymar jogador de futebol do barsemlona','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSq-FoDF-DbpqB35H4BHxMHwzDeMYszGQIkgim1D-YNaolwhl_d3QYH_0-b9XdQ0OVdbmmzk8gJ-h4xb6UgJsWCJSSr3j_DKpQlML1TrjF&s=10');
/*!40000 ALTER TABLE `tbl_dublador` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_filme`
--

DROP TABLE IF EXISTS `tbl_filme`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_filme` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `sinopse` text,
  `data_lancamento` date DEFAULT NULL,
  `duracao` time NOT NULL,
  `orcamento` decimal(11,2) NOT NULL,
  `trailer` varchar(200) DEFAULT NULL,
  `capa` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_filme`
--

LOCK TABLES `tbl_filme` WRITE;
/*!40000 ALTER TABLE `tbl_filme` DISABLE KEYS */;
INSERT INTO `tbl_filme` VALUES (1,'Gente Grande','A morte do treinador de basquete de infância de velhos amigos reúne a turma no mesmo lugar que celebraram um campeonato anos atrás. Os amigos, acompanhados de suas esposas e filhos, descobrem que idade não significa o mesmo que maturidade.','2010-09-24','01:00:00',800000.00,'','aaaaaaaaaaaaaaaaaaaaaaa'),(2,'Carros','Relâmpago McQueen (Owen Wilson) é um carro de corridas ambicioso, que já em sua 1ª temporada na Copa Pistão torna-se um astro. Ele sonha em se tornar o 1º estreante a vencer o campeonato, o que possibilitaria que assinasse um patrocínio com a cobiçada Dinoco. A fama faz com que Relâmpago acredite que não precisa da ajuda de ninguém, sendo uma \"equipe de um carro só\". Esta arrogância lhe custa caro na última corrida da temporada, fazendo com que seus dois pneus traseiros estourem na última volta da corrida. O problema permite que seus dois principais adversários, o ídolo Rei (Richard Petty) e o traiçoeiro Chicks (Michael Keaton), cruzem a linha de chegada juntamente com ele, o que faz com que uma corrida de desempate seja agendada na California. Relâmpago é então levado para o local de corrida por Mack (John Ratzenberger), um caminhão que faz parte de sua equipe. Ele quer chegar ao local antes de seus competidores e, por causa disto, insiste que Mack viage sem interrupções. Mack termina dormindo em pleno trânsito, o que faz com que a caçamba se abra e Relâmpago, que também estava dormindo, seja largado em plena estrada. Ao acordar Relâmpago tenta encontrar Mack a todo custo, mas não tem sucesso. Em seu desespero ele chega à pequena Radiator Springs, uma cidade do interior que tem pouquíssimo movimento e que jamais ouviu falar de Relâmpago ou até mesmo da Copa Pistão. Porém, por ter destruído a principal rua da cidade, Relâmpago é condenado a reasfaltá-la. Obrigado a permanecer na cidade contra a sua vontade, aos poucos ele conhece os habitantes locais e começa a se afeiçoar por eles.','2006-06-30','01:57:00',120000000.00,NULL,NULL),(3,'Gente Grande','A morte do treinador de basquete de infância de velhos amigos reúne a turma no mesmo lugar que celebraram um campeonato anos atrás. Os amigos, acompanhados de suas esposas e filhos, descobrem que idade não significa o mesmo que maturidade.','2010-09-24','01:42:00',75000000.00,NULL,NULL),(4,'Homem-aranha','Ao ser picado por uma aranha geneticamente modificada em uma demonstração científica, o jovem nerd Peter Parker ganha superpoderes. Inicialmente, ele pretende usá-los para ganhar dinheiro, adotando o nome de Homem-Aranha e se apresentando em lutas de exibição. Porém, ao presenciar o assassinato de seu tio Ben e sentir-se culpado, Peter decide não mais usar seus poderes para proveito próprio e sim para enfrentar o mal, tendo como seu primeiro grande desafio o psicótico Duende Verde.','2002-05-17','02:06:00',139000000.00,NULL,NULL),(5,'Operaçao','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','2020-01-24','02:00:00',75000000.00,'','kdkdkkdkdkd'),(6,'Operaçao','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','2020-01-24','02:00:00',75000000.00,'','kdkdkkdkdkd'),(7,'Operaçao','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','2020-01-24','02:00:00',75000000.00,'','kdkdkkdkdkd'),(10,'apuros','ele esta em apuros por causa de mim!!!!!','2025-05-31','01:00:00',75000000.00,'','kdkdkkdkdkd'),(11,'apuros','ele esta em apuros por causa de mim!!!!!','2025-05-31','01:00:00',75000000.00,'','kdkdkkdkdkd'),(12,'apuros','ele esta em apuros por causa de mim!!!!!','2025-05-31','01:00:00',75000000.00,'','kdkdkkdkdkd'),(13,'apuros','ele esta em apuros por causa de mim!!!!!','2025-05-31','01:00:00',7500000.00,'','kdkdkkdkdkd'),(14,'apuros','ele esta em apuros por causa de mim!!!!!','2025-05-31','01:00:00',7500000.00,'','kdkdkkdkdkd'),(15,'apuros','ele esta em apuros por causa de mim!!!!!','2025-05-31','01:00:00',7500000.00,'','kdkdkkdkdkd'),(16,'apuros','ele esta em apuros por causa de mim!!!!!','2025-05-31','01:00:00',7500000.00,'','kdkdkkdkdkd'),(17,'apuros','ele esta em apuros por causa de mim!!!!!','2025-05-31','01:00:00',7500000.00,'','kdkdkkdkdkd'),(18,'apuros','ele esta em apuros por causa de mim!!!!!','2025-05-31','01:00:00',7500000.00,'','kdkdkkdkdkd'),(19,'apuros','ele esta em apuros por causa de mim!!!!!','2025-05-31','01:00:00',7500000.00,'','kdkdkkdkdkd'),(20,'apuros','ele esta em apuros por causa de mim!!!!!','2025-05-31','01:00:00',7500000.00,'','kdkdkkdkdkd'),(21,'apuros','ele esta em apuros por causa de mim!!!!!','2025-05-31','01:00:00',7500000.00,'','kdkdkkdkdkd');
/*!40000 ALTER TABLE `tbl_filme` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_genero`
--

DROP TABLE IF EXISTS `tbl_genero`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_genero` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(20) NOT NULL,
  `descricao` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_genero`
--

LOCK TABLES `tbl_genero` WRITE;
/*!40000 ALTER TABLE `tbl_genero` DISABLE KEYS */;
INSERT INTO `tbl_genero` VALUES (2,'Experimental','Gênero focado em formas não convencionais de narrativos'),(3,'Drama','Aborda temas sérios, frequentemente explorando emoções intensas.'),(4,'Comedia','Filmes feitos para fazer rir, como a comédia romântica ou o pastelão.'),(5,'Experimental','Gênero focado em formas não convencionais de narrativos'),(21,'Teror','Geralmente envolve Mortes'),(22,'Suspense','Geralmente envolve Mortes e suspenses');
/*!40000 ALTER TABLE `tbl_genero` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_idioma`
--

DROP TABLE IF EXISTS `tbl_idioma`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_idioma` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(80) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_idioma`
--

LOCK TABLES `tbl_idioma` WRITE;
/*!40000 ALTER TABLE `tbl_idioma` DISABLE KEYS */;
INSERT INTO `tbl_idioma` VALUES (1,'Brasil'),(2,'Ingles'),(3,'Inglaterra');
/*!40000 ALTER TABLE `tbl_idioma` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_pais`
--

DROP TABLE IF EXISTS `tbl_pais`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_pais` (
  `pais_id` int NOT NULL AUTO_INCREMENT,
  `pais` varchar(60) NOT NULL,
  PRIMARY KEY (`pais_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_pais`
--

LOCK TABLES `tbl_pais` WRITE;
/*!40000 ALTER TABLE `tbl_pais` DISABLE KEYS */;
INSERT INTO `tbl_pais` VALUES (1,'Brasil'),(2,'Portugal'),(3,'Estados Unidos'),(4,'Mexico'),(5,'Afeganistao'),(7,'Espanha'),(8,'Alemanha');
/*!40000 ALTER TABLE `tbl_pais` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_personagem`
--

DROP TABLE IF EXISTS `tbl_personagem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_personagem` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) NOT NULL,
  `universo` varchar(100) NOT NULL,
  `apelido` varchar(100) NOT NULL,
  `genero` varchar(30) NOT NULL,
  `idade` decimal(4,1) NOT NULL,
  `especie` varchar(100) DEFAULT NULL,
  `origem` varchar(150) DEFAULT NULL,
  `classe` varchar(100) DEFAULT NULL,
  `habilidades` varchar(200) DEFAULT NULL,
  `caracteristica` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_personagem`
--

LOCK TABLES `tbl_personagem` WRITE;
/*!40000 ALTER TABLE `tbl_personagem` DISABLE KEYS */;
INSERT INTO `tbl_personagem` VALUES (2,'Relâmpago McQueen','Carros (Pixar)','McQueen','Masculino',20.0,'Carro de Corrida (Stock Car)','Califórnia, EUA','Piloto Profissional','Alta Velocidade, Drift, Manobras em Curva','Arrogante (inicialmente), Confiante, Leal'),(3,'Relâmpago McQueen','Carros (Pixar)','McQueen','Masculino',20.0,'Carro de Corrida (Stock Car)','Califórnia, EUA','Piloto Profissional','Alta Velocidade, Drift, Manobras em Curva','Arrogante (inicialmente), Confiante, Leal'),(4,'Relâmpago McQueen','Carros (Pixar)','McQueen','Masculino',20.0,'Carro de Corrida (Stock Car)','Califórnia, EUA','Piloto Profissional','Alta Velocidade, Drift, Manobras em Curva','Arrogante (inicialmente), Confiante, Leal');
/*!40000 ALTER TABLE `tbl_personagem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_teste`
--

DROP TABLE IF EXISTS `tbl_teste`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_teste` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_teste`
--

LOCK TABLES `tbl_teste` WRITE;
/*!40000 ALTER TABLE `tbl_teste` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_teste` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'db_locadoura_filme_ds2t_25_2'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-12 16:54:24

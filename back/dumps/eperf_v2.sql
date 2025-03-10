-- MariaDB dump 10.19  Distrib 10.11.6-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: eperf_v2
-- ------------------------------------------------------
-- Server version	10.11.6-MariaDB-0+deb12u1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `action`
--

DROP TABLE IF EXISTS `action`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `action` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type_action_id` int(11) NOT NULL,
  `bien_id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `description` longtext DEFAULT NULL,
  `date_inter_theorique` datetime DEFAULT NULL,
  `duree_totale` int(11) DEFAULT NULL,
  `cout` double DEFAULT NULL,
  `date_creation` datetime DEFAULT NULL,
  `date_derniere_modif` datetime DEFAULT NULL,
  `date_cloture` datetime DEFAULT NULL,
  `statut_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_47CC8C9229F4B125` (`type_action_id`),
  KEY `IDX_47CC8C92BD95B80F` (`bien_id`),
  KEY `IDX_47CC8C92F6203804` (`statut_id`),
  CONSTRAINT `FK_47CC8C9229F4B125` FOREIGN KEY (`type_action_id`) REFERENCES `type_action` (`id`),
  CONSTRAINT `FK_47CC8C92BD95B80F` FOREIGN KEY (`bien_id`) REFERENCES `bien` (`id`),
  CONSTRAINT `FK_47CC8C92F6203804` FOREIGN KEY (`statut_id`) REFERENCES `statut_action` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `action`
--

LOCK TABLES `action` WRITE;
/*!40000 ALTER TABLE `action` DISABLE KEYS */;
/*!40000 ALTER TABLE `action` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `action_tache`
--

DROP TABLE IF EXISTS `action_tache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `action_tache` (
  `action_id` int(11) NOT NULL,
  `tache_id` int(11) NOT NULL,
  `effectuee` tinyint(1) DEFAULT NULL,
  `commentaire` varchar(1024) DEFAULT NULL,
  `date_derniere_modif` datetime DEFAULT NULL,
  PRIMARY KEY (`action_id`,`tache_id`),
  KEY `IDX_7449ECC99D32F035` (`action_id`),
  KEY `IDX_7449ECC9D2235D39` (`tache_id`),
  CONSTRAINT `FK_7449ECC99D32F035` FOREIGN KEY (`action_id`) REFERENCES `action` (`id`),
  CONSTRAINT `FK_7449ECC9D2235D39` FOREIGN KEY (`tache_id`) REFERENCES `tache` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `action_tache`
--

LOCK TABLES `action_tache` WRITE;
/*!40000 ALTER TABLE `action_tache` DISABLE KEYS */;
/*!40000 ALTER TABLE `action_tache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `action_utilisateur`
--

DROP TABLE IF EXISTS `action_utilisateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `action_utilisateur` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action_id` int(11) NOT NULL,
  `utilisateur_id` int(11) NOT NULL,
  `equipe_id` int(11) DEFAULT NULL,
  `iteration` int(11) NOT NULL,
  `date_debut` date DEFAULT NULL,
  `date_fin` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_ACTION_UTILISATEUR` (`action_id`,`utilisateur_id`,`iteration`),
  KEY `IDX_66CEEA779D32F035` (`action_id`),
  KEY `IDX_66CEEA77FB88E14F` (`utilisateur_id`),
  KEY `IDX_66CEEA776D861B89` (`equipe_id`),
  CONSTRAINT `FK_66CEEA776D861B89` FOREIGN KEY (`equipe_id`) REFERENCES `equipe` (`id`),
  CONSTRAINT `FK_66CEEA779D32F035` FOREIGN KEY (`action_id`) REFERENCES `action` (`id`),
  CONSTRAINT `FK_66CEEA77FB88E14F` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `action_utilisateur`
--

LOCK TABLES `action_utilisateur` WRITE;
/*!40000 ALTER TABLE `action_utilisateur` DISABLE KEYS */;
/*!40000 ALTER TABLE `action_utilisateur` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bien`
--

DROP TABLE IF EXISTS `bien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bien` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` longtext NOT NULL,
  `image` longtext DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `nature` varchar(255) NOT NULL,
  `societe_id` int(11) NOT NULL,
  `type_bien_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_45EDC386FCF77503` (`societe_id`),
  KEY `IDX_45EDC38695B4D7FA` (`type_bien_id`),
  CONSTRAINT `FK_45EDC38695B4D7FA` FOREIGN KEY (`type_bien_id`) REFERENCES `type_bien` (`id`),
  CONSTRAINT `FK_45EDC386FCF77503` FOREIGN KEY (`societe_id`) REFERENCES `societe` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bien`
--

LOCK TABLES `bien` WRITE;
/*!40000 ALTER TABLE `bien` DISABLE KEYS */;
/*!40000 ALTER TABLE `bien` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bien_caracteristique`
--

DROP TABLE IF EXISTS `bien_caracteristique`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bien_caracteristique` (
  `bien_id` int(11) NOT NULL,
  `caracteristique_id` int(11) NOT NULL,
  `valeur` longtext DEFAULT NULL,
  `priorite` int(11) DEFAULT NULL,
  PRIMARY KEY (`bien_id`,`caracteristique_id`),
  KEY `IDX_2E0F0EE0BD95B80F` (`bien_id`),
  KEY `IDX_2E0F0EE01704EEB7` (`caracteristique_id`),
  CONSTRAINT `FK_2E0F0EE01704EEB7` FOREIGN KEY (`caracteristique_id`) REFERENCES `caracteristique` (`id`),
  CONSTRAINT `FK_2E0F0EE0BD95B80F` FOREIGN KEY (`bien_id`) REFERENCES `bien` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bien_caracteristique`
--

LOCK TABLES `bien_caracteristique` WRITE;
/*!40000 ALTER TABLE `bien_caracteristique` DISABLE KEYS */;
/*!40000 ALTER TABLE `bien_caracteristique` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `caracteristique`
--

DROP TABLE IF EXISTS `caracteristique`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `caracteristique` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `societe_id` int(11) NOT NULL,
  `type_bien_id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `valeur_defaut` varchar(1024) DEFAULT NULL,
  `obligatoire` tinyint(1) DEFAULT NULL,
  `liste_valeurs` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '(DC2Type:json)' CHECK (json_valid(`liste_valeurs`)),
  `type_champ` varchar(255) NOT NULL,
  `unite_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_D14FBE8BFCF77503` (`societe_id`),
  KEY `IDX_D14FBE8B95B4D7FA` (`type_bien_id`),
  KEY `IDX_D14FBE8BEC4A74AB` (`unite_id`),
  CONSTRAINT `FK_D14FBE8B95B4D7FA` FOREIGN KEY (`type_bien_id`) REFERENCES `type_bien` (`id`),
  CONSTRAINT `FK_D14FBE8BEC4A74AB` FOREIGN KEY (`unite_id`) REFERENCES `unite` (`id`),
  CONSTRAINT `FK_D14FBE8BFCF77503` FOREIGN KEY (`societe_id`) REFERENCES `societe` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `caracteristique`
--

LOCK TABLES `caracteristique` WRITE;
/*!40000 ALTER TABLE `caracteristique` DISABLE KEYS */;
/*!40000 ALTER TABLE `caracteristique` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `composant`
--

DROP TABLE IF EXISTS `composant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `composant` (
  `id` int(11) NOT NULL,
  `equipement_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_EC8486C9806F0F5C` (`equipement_id`),
  CONSTRAINT `FK_EC8486C9806F0F5C` FOREIGN KEY (`equipement_id`) REFERENCES `equipement` (`id`),
  CONSTRAINT `FK_EC8486C9BF396750` FOREIGN KEY (`id`) REFERENCES `bien` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `composant`
--

LOCK TABLES `composant` WRITE;
/*!40000 ALTER TABLE `composant` DISABLE KEYS */;
/*!40000 ALTER TABLE `composant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipe`
--

DROP TABLE IF EXISTS `equipe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `equipe` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `societe_id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `libelle` varchar(255) NOT NULL,
  `date_derniere_modif` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_2449BA15FCF77503` (`societe_id`),
  CONSTRAINT `FK_2449BA15FCF77503` FOREIGN KEY (`societe_id`) REFERENCES `societe` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipe`
--

LOCK TABLES `equipe` WRITE;
/*!40000 ALTER TABLE `equipe` DISABLE KEYS */;
/*!40000 ALTER TABLE `equipe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipe_utilisateur`
--

DROP TABLE IF EXISTS `equipe_utilisateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `equipe_utilisateur` (
  `equipe_id` int(11) NOT NULL,
  `utilisateur_id` int(11) NOT NULL,
  `fonction_utilisateur_id` int(11) NOT NULL,
  PRIMARY KEY (`equipe_id`,`utilisateur_id`),
  KEY `IDX_D78C92636D861B89` (`equipe_id`),
  KEY `IDX_D78C9263FB88E14F` (`utilisateur_id`),
  KEY `IDX_D78C9263E4ADEF25` (`fonction_utilisateur_id`),
  CONSTRAINT `FK_D78C92636D861B89` FOREIGN KEY (`equipe_id`) REFERENCES `equipe` (`id`),
  CONSTRAINT `FK_D78C9263E4ADEF25` FOREIGN KEY (`fonction_utilisateur_id`) REFERENCES `fonction_utilisateur` (`id`),
  CONSTRAINT `FK_D78C9263FB88E14F` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipe_utilisateur`
--

LOCK TABLES `equipe_utilisateur` WRITE;
/*!40000 ALTER TABLE `equipe_utilisateur` DISABLE KEYS */;
/*!40000 ALTER TABLE `equipe_utilisateur` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipement`
--

DROP TABLE IF EXISTS `equipement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `equipement` (
  `id` int(11) NOT NULL,
  `ouvrage_id` int(11) DEFAULT NULL,
  `site_id` int(11) NOT NULL,
  `relevable` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_B8B4C6F315D884B5` (`ouvrage_id`),
  KEY `IDX_B8B4C6F3F6BD1646` (`site_id`),
  CONSTRAINT `FK_B8B4C6F315D884B5` FOREIGN KEY (`ouvrage_id`) REFERENCES `ouvrage` (`id`),
  CONSTRAINT `FK_B8B4C6F3BF396750` FOREIGN KEY (`id`) REFERENCES `bien` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_B8B4C6F3F6BD1646` FOREIGN KEY (`site_id`) REFERENCES `site` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipement`
--

LOCK TABLES `equipement` WRITE;
/*!40000 ALTER TABLE `equipement` DISABLE KEYS */;
/*!40000 ALTER TABLE `equipement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `etiquette`
--

DROP TABLE IF EXISTS `etiquette`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `etiquette` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `societe_id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `libelle` varchar(255) NOT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_1E0E195AFCF77503` (`societe_id`),
  CONSTRAINT `FK_1E0E195AFCF77503` FOREIGN KEY (`societe_id`) REFERENCES `societe` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `etiquette`
--

LOCK TABLES `etiquette` WRITE;
/*!40000 ALTER TABLE `etiquette` DISABLE KEYS */;
/*!40000 ALTER TABLE `etiquette` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `etiquette_bien`
--

DROP TABLE IF EXISTS `etiquette_bien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `etiquette_bien` (
  `etiquette_id` int(11) NOT NULL,
  `bien_id` int(11) NOT NULL,
  PRIMARY KEY (`etiquette_id`,`bien_id`),
  KEY `IDX_99A56E377BD2EA57` (`etiquette_id`),
  KEY `IDX_99A56E37BD95B80F` (`bien_id`),
  CONSTRAINT `FK_99A56E377BD2EA57` FOREIGN KEY (`etiquette_id`) REFERENCES `etiquette` (`id`),
  CONSTRAINT `FK_99A56E37BD95B80F` FOREIGN KEY (`bien_id`) REFERENCES `bien` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `etiquette_bien`
--

LOCK TABLES `etiquette_bien` WRITE;
/*!40000 ALTER TABLE `etiquette_bien` DISABLE KEYS */;
/*!40000 ALTER TABLE `etiquette_bien` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fonction_utilisateur`
--

DROP TABLE IF EXISTS `fonction_utilisateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fonction_utilisateur` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fonction` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fonction_utilisateur`
--

LOCK TABLES `fonction_utilisateur` WRITE;
/*!40000 ALTER TABLE `fonction_utilisateur` DISABLE KEYS */;
INSERT INTO `fonction_utilisateur` VALUES
(1,'Responsable'),
(2,'Agent d\'exploitation'),
(3,'Agent d\'entretien'),
(4,'Responsable'),
(5,'Agent d\'exploitation'),
(6,'Electromécanicien');
/*!40000 ALTER TABLE `fonction_utilisateur` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groupe_tache`
--

DROP TABLE IF EXISTS `groupe_tache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `groupe_tache` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `societe_id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `libelle` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_C62AEE25FCF77503` (`societe_id`),
  CONSTRAINT `FK_C62AEE25FCF77503` FOREIGN KEY (`societe_id`) REFERENCES `societe` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groupe_tache`
--

LOCK TABLES `groupe_tache` WRITE;
/*!40000 ALTER TABLE `groupe_tache` DISABLE KEYS */;
/*!40000 ALTER TABLE `groupe_tache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messenger_messages`
--

DROP TABLE IF EXISTS `messenger_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `messenger_messages` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `body` longtext NOT NULL,
  `headers` longtext NOT NULL,
  `queue_name` varchar(190) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `available_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `delivered_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)',
  PRIMARY KEY (`id`),
  KEY `IDX_75EA56E0FB7336F0` (`queue_name`),
  KEY `IDX_75EA56E0E3BD61CE` (`available_at`),
  KEY `IDX_75EA56E016BA31DB` (`delivered_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messenger_messages`
--

LOCK TABLES `messenger_messages` WRITE;
/*!40000 ALTER TABLE `messenger_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messenger_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth2_access_token`
--

DROP TABLE IF EXISTS `oauth2_access_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `oauth2_access_token` (
  `identifier` char(80) NOT NULL,
  `client` varchar(32) NOT NULL,
  `expiry` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `user_identifier` varchar(128) DEFAULT NULL,
  `scopes` text DEFAULT NULL COMMENT '(DC2Type:oauth2_scope)',
  `revoked` tinyint(1) NOT NULL,
  PRIMARY KEY (`identifier`),
  KEY `IDX_454D9673C7440455` (`client`),
  CONSTRAINT `FK_454D9673C7440455` FOREIGN KEY (`client`) REFERENCES `oauth2_client` (`identifier`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth2_access_token`
--

LOCK TABLES `oauth2_access_token` WRITE;
/*!40000 ALTER TABLE `oauth2_access_token` DISABLE KEYS */;
INSERT INTO `oauth2_access_token` VALUES
('190f15b1053b32ab1723e068f5c845a7f4eaa29571a05ddf2eb4b4c9c9d93525a8902f1012969593','backend_client','2024-11-21 12:06:53',NULL,'email',0),
('1b749560b250cb8b7b799a15db171de8f63ae812670fc507ba912dfa2cb082d8814d9e8ff1084489','frontend_client','2024-11-26 12:19:14','demo','public',0),
('3d213638f72d8d149efff53d0107533809ad37f86c9884171e21b70dc44d6f237f1a5afc35b7244b','frontend_client','2024-11-26 10:34:06','demo','public',1),
('6bda892144381858d9f3d3c96f98fd10e050e8e28989a8f05c574fb6338709ea92f39e5a94069501','frontend_client','2024-11-26 12:29:03','demo','public',0),
('71a829dba159c8b4399ddbdb39f68550ec0426a74996a48245df9167f01e5d2099b2baaf1c04ec8a','frontend_client','2024-11-26 10:13:50','demo','public',0),
('99dcc53dfc6486059afc13814d1dcf986d7b258976008f3412bbc7120ccaf3ecb192accaed999b8d','frontend_client','2024-11-26 13:04:32','demo','public',0),
('cd6f94d7dcc071caac4379f320a879e3713b96e85d3b0e16d451ff91cb0bda1eaafc7db79b795e1e','frontend_client','2024-11-26 10:34:21','demo','public',0),
('cf52b33b0d068f1f0fd553af92ae6ce73aa85c3f0f6286753c7679180eddf0bf1107249b517ba1ff','frontend_client','2024-11-26 12:29:16','demo','public',0),
('d1e91870b5a7e7115251cce8df12b6151a5658b4cd0c6ad5cc0b4f1f85fa9c7fc7b0bc46eb32ded0','frontend_client','2024-11-26 15:00:39','demo','public',0),
('daa81be328d2fb335ba52cc1ad310a52e72ef1746631f4865db809132574c9c3bd28c97345338459','frontend_client','2024-11-26 16:12:50','demo','public',0),
('f01c1f49968ff2e10d00895b84fa57dbbab6040370f3c8e51bfb382c1cffca353f308e8c3f05baf8','frontend_client','2024-11-26 16:10:56','demo','public',0),
('f511b78ee114019fb43fbdb34ee7a8c1d46b380af2ee6ee930006e5811cd14c473724a966a6adec2','frontend_client','2024-11-26 15:28:52','demo','public',0);
/*!40000 ALTER TABLE `oauth2_access_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth2_authorization_code`
--

DROP TABLE IF EXISTS `oauth2_authorization_code`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `oauth2_authorization_code` (
  `identifier` char(80) NOT NULL,
  `client` varchar(32) NOT NULL,
  `expiry` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `user_identifier` varchar(128) DEFAULT NULL,
  `scopes` text DEFAULT NULL COMMENT '(DC2Type:oauth2_scope)',
  `revoked` tinyint(1) NOT NULL,
  PRIMARY KEY (`identifier`),
  KEY `IDX_509FEF5FC7440455` (`client`),
  CONSTRAINT `FK_509FEF5FC7440455` FOREIGN KEY (`client`) REFERENCES `oauth2_client` (`identifier`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth2_authorization_code`
--

LOCK TABLES `oauth2_authorization_code` WRITE;
/*!40000 ALTER TABLE `oauth2_authorization_code` DISABLE KEYS */;
/*!40000 ALTER TABLE `oauth2_authorization_code` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth2_client`
--

DROP TABLE IF EXISTS `oauth2_client`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `oauth2_client` (
  `identifier` varchar(32) NOT NULL,
  `name` varchar(128) NOT NULL,
  `secret` varchar(128) DEFAULT NULL,
  `redirect_uris` text DEFAULT NULL COMMENT '(DC2Type:oauth2_redirect_uri)',
  `grants` text DEFAULT NULL COMMENT '(DC2Type:oauth2_grant)',
  `scopes` text DEFAULT NULL COMMENT '(DC2Type:oauth2_scope)',
  `active` tinyint(1) NOT NULL,
  `allow_plain_text_pkce` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`identifier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth2_client`
--

LOCK TABLES `oauth2_client` WRITE;
/*!40000 ALTER TABLE `oauth2_client` DISABLE KEYS */;
INSERT INTO `oauth2_client` VALUES
('backend_client','eperf','15b96280c6abe183f0dea6b131ce3b044a2656b76008f759fce106cdaa71604261c0fb36e74f10141689761c36d96509eba6065176239e33cbf50bb820fc54e7',NULL,'client_credentials','email',1,0),
('frontend_client','eperf','b9fc290e803fa93a4a17ec708a65e574cf5e7ab381d027b100c62f512ccbc84c6eacd88f06b0b6a97a521fabca2a3dd0ef4ab7914aec530f3aea1dacc33ae368',NULL,'password refresh_token','public',1,0);
/*!40000 ALTER TABLE `oauth2_client` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth2_refresh_token`
--

DROP TABLE IF EXISTS `oauth2_refresh_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `oauth2_refresh_token` (
  `identifier` char(80) NOT NULL,
  `access_token` char(80) DEFAULT NULL,
  `expiry` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `revoked` tinyint(1) NOT NULL,
  PRIMARY KEY (`identifier`),
  KEY `IDX_4DD90732B6A2DD68` (`access_token`),
  CONSTRAINT `FK_4DD90732B6A2DD68` FOREIGN KEY (`access_token`) REFERENCES `oauth2_access_token` (`identifier`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth2_refresh_token`
--

LOCK TABLES `oauth2_refresh_token` WRITE;
/*!40000 ALTER TABLE `oauth2_refresh_token` DISABLE KEYS */;
INSERT INTO `oauth2_refresh_token` VALUES
('156a70809da7bbb7e29d2663ab2c7696bf6478511b9b8a49d35d9c95093ef66f17e051d58ee6d0be','cf52b33b0d068f1f0fd553af92ae6ce73aa85c3f0f6286753c7679180eddf0bf1107249b517ba1ff','2024-12-26 11:29:16',0),
('2c99057125cee49f5e1103abe37d29e94b9f6bca65c5c67a13e8fd9f93074814aa9d9295bd7c568f','f01c1f49968ff2e10d00895b84fa57dbbab6040370f3c8e51bfb382c1cffca353f308e8c3f05baf8','2024-12-26 15:10:56',0),
('2e37e40807d86117b9391e5dcb6fbcdc384060724e3917cbbb5f6ee9012de8fb6f1a776607efd46d','daa81be328d2fb335ba52cc1ad310a52e72ef1746631f4865db809132574c9c3bd28c97345338459','2024-12-26 15:12:50',0),
('2f8335a17b12528bf6759902ab71b50c361c04400b790b7b05cd2f053c84b22e059a51315fe49c87','cd6f94d7dcc071caac4379f320a879e3713b96e85d3b0e16d451ff91cb0bda1eaafc7db79b795e1e','2024-12-26 09:34:21',0),
('3f3c4a7536f03ffb0096e1213b1b217d392576fae6f04f4309efea7bf4425c1c36db0fc61e3cc171','71a829dba159c8b4399ddbdb39f68550ec0426a74996a48245df9167f01e5d2099b2baaf1c04ec8a','2024-12-26 09:13:50',0),
('5d8cb9bedf39cc69d94fd5cc8822a05c42492dc93db6072d91c33ff1b4b26fa8214b0e8b42f6c56e','f511b78ee114019fb43fbdb34ee7a8c1d46b380af2ee6ee930006e5811cd14c473724a966a6adec2','2024-12-26 14:28:52',0),
('6ac31ee3e408702ad35d304f1065dffaf069f5274e205dc7dc5c5c47a8517554d65f2e6ccb3f0ed2','99dcc53dfc6486059afc13814d1dcf986d7b258976008f3412bbc7120ccaf3ecb192accaed999b8d','2024-12-26 12:04:32',0),
('82a8f4a9c899c85cb57ddfdea90b256c03cea3417e71f599136b3b400707bcb85509eeebd33a1138','1b749560b250cb8b7b799a15db171de8f63ae812670fc507ba912dfa2cb082d8814d9e8ff1084489','2024-12-26 11:19:14',0),
('967862e2215c8f0ed307179e183529d3294a54842c88704ef12bf50eb6a97dd71b4b55eecdfaed3d','d1e91870b5a7e7115251cce8df12b6151a5658b4cd0c6ad5cc0b4f1f85fa9c7fc7b0bc46eb32ded0','2024-12-26 14:00:39',0),
('9bd2e2c2d6fea99784f13c546a693da47e4382d5fb5a9c02f9897ea10cc0cc9b4e747eed9e371709','6bda892144381858d9f3d3c96f98fd10e050e8e28989a8f05c574fb6338709ea92f39e5a94069501','2024-12-26 11:29:03',0),
('a7de61fb1cd00a7a7455e3b80840926c49ee1d77295e4c369e22a5e6bd6553e2de2b31999294ad96','3d213638f72d8d149efff53d0107533809ad37f86c9884171e21b70dc44d6f237f1a5afc35b7244b','2024-12-26 09:34:06',1);
/*!40000 ALTER TABLE `oauth2_refresh_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ouvrage`
--

DROP TABLE IF EXISTS `ouvrage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ouvrage` (
  `id` int(11) NOT NULL,
  `site_id` int(11) NOT NULL,
  `position` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_52A8CBD8F6BD1646` (`site_id`),
  CONSTRAINT `FK_52A8CBD8BF396750` FOREIGN KEY (`id`) REFERENCES `bien` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_52A8CBD8F6BD1646` FOREIGN KEY (`site_id`) REFERENCES `site` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ouvrage`
--

LOCK TABLES `ouvrage` WRITE;
/*!40000 ALTER TABLE `ouvrage` DISABLE KEYS */;
/*!40000 ALTER TABLE `ouvrage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `releve`
--

DROP TABLE IF EXISTS `releve`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `releve` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `equipement_id` int(11) NOT NULL,
  `type_releve_id` int(11) NOT NULL,
  `valeur` varchar(255) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_DDABFF83806F0F5C` (`equipement_id`),
  KEY `IDX_DDABFF83E3D4A636` (`type_releve_id`),
  CONSTRAINT `FK_DDABFF83806F0F5C` FOREIGN KEY (`equipement_id`) REFERENCES `equipement` (`id`),
  CONSTRAINT `FK_DDABFF83E3D4A636` FOREIGN KEY (`type_releve_id`) REFERENCES `type_releve` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `releve`
--

LOCK TABLES `releve` WRITE;
/*!40000 ALTER TABLE `releve` DISABLE KEYS */;
/*!40000 ALTER TABLE `releve` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `secteur`
--

DROP TABLE IF EXISTS `secteur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `secteur` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `societe_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_8045251FFCF77503` (`societe_id`),
  CONSTRAINT `FK_8045251FFCF77503` FOREIGN KEY (`societe_id`) REFERENCES `societe` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `secteur`
--

LOCK TABLES `secteur` WRITE;
/*!40000 ALTER TABLE `secteur` DISABLE KEYS */;
/*!40000 ALTER TABLE `secteur` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `secteur_site`
--

DROP TABLE IF EXISTS `secteur_site`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `secteur_site` (
  `secteur_id` int(11) NOT NULL,
  `site_id` int(11) NOT NULL,
  PRIMARY KEY (`secteur_id`,`site_id`),
  KEY `IDX_CE8F1C09F7E4405` (`secteur_id`),
  KEY `IDX_CE8F1C0F6BD1646` (`site_id`),
  CONSTRAINT `FK_CE8F1C09F7E4405` FOREIGN KEY (`secteur_id`) REFERENCES `secteur` (`id`),
  CONSTRAINT `FK_CE8F1C0F6BD1646` FOREIGN KEY (`site_id`) REFERENCES `site` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `secteur_site`
--

LOCK TABLES `secteur_site` WRITE;
/*!40000 ALTER TABLE `secteur_site` DISABLE KEYS */;
/*!40000 ALTER TABLE `secteur_site` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `secteur_utilisateur`
--

DROP TABLE IF EXISTS `secteur_utilisateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `secteur_utilisateur` (
  `secteur_id` int(11) NOT NULL,
  `utilisateur_id` int(11) NOT NULL,
  PRIMARY KEY (`secteur_id`,`utilisateur_id`),
  KEY `IDX_D4204CFE9F7E4405` (`secteur_id`),
  KEY `IDX_D4204CFEFB88E14F` (`utilisateur_id`),
  CONSTRAINT `FK_D4204CFE9F7E4405` FOREIGN KEY (`secteur_id`) REFERENCES `secteur` (`id`),
  CONSTRAINT `FK_D4204CFEFB88E14F` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `secteur_utilisateur`
--

LOCK TABLES `secteur_utilisateur` WRITE;
/*!40000 ALTER TABLE `secteur_utilisateur` DISABLE KEYS */;
/*!40000 ALTER TABLE `secteur_utilisateur` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site`
--

DROP TABLE IF EXISTS `site`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `site` (
  `id` int(11) NOT NULL,
  `type_site_id` int(11) NOT NULL,
  `ville_id` int(11) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_694309E4DE9C79B3` (`type_site_id`),
  KEY `IDX_694309E4A73F0036` (`ville_id`),
  CONSTRAINT `FK_694309E4A73F0036` FOREIGN KEY (`ville_id`) REFERENCES `ville` (`id`),
  CONSTRAINT `FK_694309E4BF396750` FOREIGN KEY (`id`) REFERENCES `bien` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_694309E4DE9C79B3` FOREIGN KEY (`type_site_id`) REFERENCES `type_site` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site`
--

LOCK TABLES `site` WRITE;
/*!40000 ALTER TABLE `site` DISABLE KEYS */;
/*!40000 ALTER TABLE `site` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `societe`
--

DROP TABLE IF EXISTS `societe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `societe` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(2048) NOT NULL,
  `logo` varchar(1024) DEFAULT NULL,
  `backcolor` varchar(16) DEFAULT NULL,
  `eperf_data` int(11) NOT NULL,
  `bon_dt_heure` tinyint(1) NOT NULL,
  `adresse_1` varchar(250) DEFAULT NULL,
  `adresse_2` varchar(250) DEFAULT NULL,
  `codepostal` varchar(10) DEFAULT NULL,
  `ville` varchar(250) DEFAULT NULL,
  `tel_1` varchar(25) DEFAULT NULL,
  `tel_2` varchar(25) DEFAULT NULL,
  `email` varchar(250) DEFAULT NULL,
  `biblio_maj` tinyint(1) NOT NULL,
  `code_api_rest` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3001 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `societe`
--

LOCK TABLES `societe` WRITE;
/*!40000 ALTER TABLE `societe` DISABLE KEYS */;
INSERT INTO `societe` VALUES
(1,'Niort agglo','niort.png','#ecf0f5',1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL),
(2,'Régie des eaux d\'Auzeville','btd_eperf.png','#ecf0f5',0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL),
(3,'Pays de Nay','nay.png','#ecf0f5',0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL),
(4,'Biotrade','btd_eperf.png','#ecf0f5',0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL),
(5,'CARCASSONNE AGGLO','carcassonne.png','#ecf0f5',0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL),
(6,'SICOVAL','sicoval.png','#ecf0f5',0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL),
(7,'RESEAU31 old','btd_eperf.png','#ecf0f5',0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL),
(8,'RÉGIE EAURECA','logo_eau_reca.jpg','#ecf0f5',1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL),
(9,'SMDEA','','#ecf0f5',0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL),
(10,'Régie des eaux Decazeville','','#ecf0f5',0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL),
(11,'RCEAC Graulhet','','',0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL),
(12,'Syndicat de Fargues-Langon-Toulenne ','logo_siaflt.png','',1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL),
(14,'SAG (Saudrune Ariège Garonne)','','',0,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL),
(15,'CC Bayonne-Anglet-Biarritz','','',1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'a32y89'),
(16,'CC de Lesneven','','',0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL),
(17,'RESEAU31','','#ecf0f5',1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL),
(21,'Lot SYDED','','#ecf0f5',1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL),
(24,'Metz','','#ecf0f5',0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL),
(25,'Epernay Agglo Champagne','','#ecf0f5',1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL),
(26,'SYDEC des Landes','','#ecf0f5',1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL),
(27,'Morlaix Communauté','','#ecf0f5',0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL),
(28,'Dracénie Provence Verdon Agglomération','','#ecf0f5',0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL),
(1000,'demo','btd_eperf.png','#ecf0f5',0,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL),
(1002,'demo ecp','btd_eperf.png','#ecf0f5',0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL),
(1003,'Test','','#ecf0f5',0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL),
(1004,'copie_bayonne','','#ecf0f5',0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL),
(1005,'niort_test','','#ecf0f5',2,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL),
(1006,'niort_test2','','#ecf0f5',0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL),
(1009,'Démo STURNO','btd_eperf.png','',0,0,'','','','AVRANCHES','',NULL,'',0,NULL),
(2000,'Mayenne Communauté','mayenne.jpg','',0,0,'10 rue de Verdun','CS 60111','53103','MAYENNE','02.43.30.21.48',NULL,'spanc@mayennecommunaute.fr',0,NULL),
(2001,'Eperf Spanc','btd_eperf.png','',0,0,'Chemin des Palanques',NULL,'31120','Portet','06.52.33.76.98',NULL,NULL,0,NULL),
(2002,'C.A grand Montauban O d’alba','logo_general.png','',0,0,'146, route d\'Albefeuille Lagarde','','82000','MONTAUBAN',' 05.63.91.81.40',NULL,'',0,NULL),
(2003,'C.C. Castelnaudary Lauragais Audois','logo22_0001.png','',0,0,'','','','Castelnaudary','',NULL,'',0,NULL),
(2004,'C.C. PIEGE LAURAGAIS MALPERE','Logo_CCPLM.png','',0,0,'','','','BRAM','',NULL,'',0,NULL),
(2005,'SIEA de la Vallée du Job','logo_siea.png','',0,0,'','','','ASPET','',NULL,'',0,NULL),
(2006,'Syndicat Armagnac Ténarèze','logo_sat.png','',0,0,'','','','EAUZE','',NULL,'',1,NULL),
(2007,'COMMUNAUTÉ DE COMMUNES CŒUR DE LOIRE','CoeurDeLoire_ComCom.png','',0,0,'','','','DONZY','03.86.28.92.92',NULL,'',0,'W32y89m'),
(2010,'Spanc test montage','btd_eperf.png','',0,0,'Chemin des Palanques',NULL,'31120','Portet','06.52.33.76.98',NULL,NULL,0,NULL),
(2011,'COMMUNAUTÉ DE COMMUNES CŒUR DE LOIRE','CoeurDeLoire_ComCom.png','',0,0,'','','','DONZY','03.86.28.92.92',NULL,'',0,'W32y89m'),
(2012,'Epernay Agglo','btd_eperf.png','',0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL),
(2013,'Bastides et Vallons du Gers','btd_eperf.png','',0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL),
(2014,'Limoges Métropole','btd_eperf.png','',0,0,NULL,NULL,NULL,'Limoges',NULL,NULL,NULL,0,NULL),
(3000,'BIOTRADE Démo','btd_eperf.png','',0,0,'48 Chemin des Palanques Sud,','Zone Industrielle','31120','PORTET SUR GARONNE','07 43 10 10 35',NULL,'support@biotrade.fr',1,NULL);
/*!40000 ALTER TABLE `societe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `societe_sans_statut`
--

DROP TABLE IF EXISTS `societe_sans_statut`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `societe_sans_statut` (
  `societe_id` int(11) NOT NULL,
  `statut_id` int(11) NOT NULL,
  PRIMARY KEY (`societe_id`,`statut_id`),
  KEY `IDX_658839A6FCF77503` (`societe_id`),
  KEY `IDX_658839A6F6203804` (`statut_id`),
  CONSTRAINT `FK_658839A6F6203804` FOREIGN KEY (`statut_id`) REFERENCES `statut_action` (`id`),
  CONSTRAINT `FK_658839A6FCF77503` FOREIGN KEY (`societe_id`) REFERENCES `societe` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `societe_sans_statut`
--

LOCK TABLES `societe_sans_statut` WRITE;
/*!40000 ALTER TABLE `societe_sans_statut` DISABLE KEYS */;
/*!40000 ALTER TABLE `societe_sans_statut` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `statut_action`
--

DROP TABLE IF EXISTS `statut_action`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `statut_action` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `libelle` varchar(255) DEFAULT NULL,
  `position` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `statut_action`
--

LOCK TABLES `statut_action` WRITE;
/*!40000 ALTER TABLE `statut_action` DISABLE KEYS */;
/*!40000 ALTER TABLE `statut_action` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tache`
--

DROP TABLE IF EXISTS `tache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tache` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `groupe_tache_id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `description` longtext DEFAULT NULL,
  `position` int(11) NOT NULL,
  `relevable` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_9387207543815649` (`groupe_tache_id`),
  CONSTRAINT `FK_9387207543815649` FOREIGN KEY (`groupe_tache_id`) REFERENCES `groupe_tache` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tache`
--

LOCK TABLES `tache` WRITE;
/*!40000 ALTER TABLE `tache` DISABLE KEYS */;
/*!40000 ALTER TABLE `tache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `type_action`
--

DROP TABLE IF EXISTS `type_action`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `type_action` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type_parent_id` int(11) DEFAULT NULL,
  `nom` varchar(255) NOT NULL,
  `libelle` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_641BE7AAC6BC8B60` (`type_parent_id`),
  CONSTRAINT `FK_641BE7AAC6BC8B60` FOREIGN KEY (`type_parent_id`) REFERENCES `type_action` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `type_action`
--

LOCK TABLES `type_action` WRITE;
/*!40000 ALTER TABLE `type_action` DISABLE KEYS */;
/*!40000 ALTER TABLE `type_action` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `type_bien`
--

DROP TABLE IF EXISTS `type_bien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `type_bien` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `societe_id` int(11) NOT NULL,
  `nature` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_92E2068EFCF77503` (`societe_id`),
  CONSTRAINT `FK_92E2068EFCF77503` FOREIGN KEY (`societe_id`) REFERENCES `societe` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `type_bien`
--

LOCK TABLES `type_bien` WRITE;
/*!40000 ALTER TABLE `type_bien` DISABLE KEYS */;
/*!40000 ALTER TABLE `type_bien` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `type_releve`
--

DROP TABLE IF EXISTS `type_releve`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `type_releve` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `type_releve`
--

LOCK TABLES `type_releve` WRITE;
/*!40000 ALTER TABLE `type_releve` DISABLE KEYS */;
/*!40000 ALTER TABLE `type_releve` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `type_site`
--

DROP TABLE IF EXISTS `type_site`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `type_site` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(1024) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `type_site`
--

LOCK TABLES `type_site` WRITE;
/*!40000 ALTER TABLE `type_site` DISABLE KEYS */;
/*!40000 ALTER TABLE `type_site` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unite`
--

DROP TABLE IF EXISTS `unite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `unite` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `libelle` varchar(255) NOT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unite`
--

LOCK TABLES `unite` WRITE;
/*!40000 ALTER TABLE `unite` DISABLE KEYS */;
/*!40000 ALTER TABLE `unite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `utilisateur` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `societe_id` int(11) NOT NULL,
  `fonction_utilisateur_id` int(11) DEFAULT NULL,
  `responsable_id` int(11) DEFAULT NULL,
  `username` varchar(180) NOT NULL,
  `roles` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '(DC2Type:json)' CHECK (json_valid(`roles`)),
  `password` varchar(255) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `fonction` varchar(30) DEFAULT NULL,
  `acces_gmao` tinyint(1) NOT NULL,
  `acces_data` tinyint(1) NOT NULL,
  `acces_spa` tinyint(1) NOT NULL,
  `acces_sandre` tinyint(1) NOT NULL,
  `step_id` varchar(50) DEFAULT NULL,
  `uniqid` varchar(50) DEFAULT NULL,
  `tel1` varchar(16) NOT NULL,
  `tel2` varchar(16) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `email_spa` tinyint(1) NOT NULL,
  `index_nbjour` int(11) NOT NULL,
  `eperf_nav` varchar(20) DEFAULT NULL,
  `est_delegation` tinyint(1) NOT NULL,
  `date_desactivation` date DEFAULT NULL,
  `date_creation` datetime DEFAULT NULL,
  `date_derniere_conn` datetime DEFAULT NULL,
  `date_etat` date DEFAULT NULL,
  `old_password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_IDENTIFIER_USERNAME` (`username`),
  KEY `IDX_1D1C63B3FCF77503` (`societe_id`),
  KEY `IDX_1D1C63B3E4ADEF25` (`fonction_utilisateur_id`),
  KEY `IDX_1D1C63B353C59D72` (`responsable_id`),
  CONSTRAINT `FK_1D1C63B353C59D72` FOREIGN KEY (`responsable_id`) REFERENCES `utilisateur` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_1D1C63B3E4ADEF25` FOREIGN KEY (`fonction_utilisateur_id`) REFERENCES `fonction_utilisateur` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_1D1C63B3FCF77503` FOREIGN KEY (`societe_id`) REFERENCES `societe` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=365 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateur`
--

LOCK TABLES `utilisateur` WRITE;
/*!40000 ALTER TABLE `utilisateur` DISABLE KEYS */;
INSERT INTO `utilisateur` VALUES
(5,17,NULL,NULL,'pocquet@biotrade.fr','[\"ROLE_MANAGER\"]','$2y$13$kdkMk0N28vpE6tzyJ2NPn.XYgLMfDy6y3fEXZO07.HZ/0WXLV4a5S','Mathieu','POCQUET','Développeur ePerf',0,0,0,0,'1,2,5,7,8,9,10,11,13,15,26,27','pocquet@biotrade.fr20190722091133','06 20 01 03 65','05 61 14 69 53','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-11-18 14:23:33','2022-01-15','$6Fg3E(p'),
(34,27,NULL,NULL,'nordine.mimouni@carc','[\"ROLE_MANAGER\"]','$2y$13$aZGvmDDkKtyBJkUCTQMMquRA79xjlCTPUdqhXjHYTDvupmuYdTeGW','Nathalie','NAMICHE','Responsable réseaux',1,0,0,0,'','mouhot@biotrade.fr20240917024528','04 68 79 87 47','07 86 83 18 18','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-05 10:00:57','2022-02-11','Nm11eperf'),
(35,27,NULL,NULL,'jerome.foulquier@car','[\"ROLE_MANAGER\"]','$2y$13$TIpVJNRtesO3KOEtMkiHye5Vio5XqPnqsBg7sxYZGR2EelnoWfEYK','Jérôme','JAMBIN','Chef de service exploitation',1,0,0,0,'','mouhot@biotrade.fr20240917024549','04 68 79 87 45','06 43 65 62 55','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-02 18:35:08','2022-02-26','Jf11eperf'),
(36,27,NULL,NULL,'gregory.garino@carca','[\"ROLE_USER\"]','$2y$13$uahTtds4eWgYdP7o0gT.ou741r4t5sZIZVVP6/HGHK5gATs6rOpGG','Grégory','GRAND','Chef de service exploitation',1,0,0,0,'','mouhot@biotrade.fr20240917024459','','','mouhot@biotrade.fr',0,5,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-05 09:13:38',NULL,'gG11eperf'),
(37,27,NULL,NULL,'user_27_2','[\"ROLE_USER\"]','$2y$13$Mo6wtHCDUWDTmlsixRqNsea0bwoMNIDhBcNavFc9F/.fXV4tAkdrO','Frédéric','FAYOL','Responsable installations',1,0,0,0,'','mouhot@biotrade.fr20240917024558','0640465456','','mouhot@biotrade.fr',0,14,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-09-17 15:23:31','2022-03-04','user_27_2'),
(39,8,NULL,NULL,'ludovic.bernabe@carc','[\"ROLE_USER\"]','$2y$13$XklE/lZZUzy4rD4L8RcfI.V4l/VWZ.2MJ4lJL.MSxm1iYEG.hWQSK','Ludovic','Bernabé','Agent d\'exploitation',0,0,0,0,'','ludovic.bernabe@carcassonne-agglo.fr20220615115716','0645730935','','mouhot@biotrade.fr',0,5,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-02 16:07:32','2022-02-07','Lb11eperf'),
(42,1000,NULL,NULL,'grasa','[\"ROLE_MANAGER\"]','$2y$13$zFqBgsU5JGrXlqfpco8qZuMvvFE29tYwFoQfQQ9EYO8Mp4HSwJ4gu','Marcel','LAMDA','Responsable',1,1,0,0,'1,2,5,7,8,9,10,11,13,15,26,27','grasa@biotrade.fr20220419023035','','05 61 14 93 30','mouhot@biotrade.fr',0,7,'0;1;0;1',0,NULL,'0000-00-00 00:00:00','2024-11-19 09:05:41','2021-11-01','grasa'),
(43,11,NULL,NULL,'numa@biotrade.fr','[\"ROLE_ADMIN\"]','$2y$13$kEvSkF4FZ1LjSrEpkTTyeupmO0ce55hkvIUdPaoBNrE4Rg3gs4JiC','Numa','GOETSCHEL','Agent d\'exploitation',0,0,0,0,'','goetschel@biotrade.fr20230127020211','06 52 33 76 98','','mouhot@biotrade.fr',0,5,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-17 11:28:16','2022-02-18','Biong31!'),
(44,8,NULL,NULL,'sebastien.reboul@car','[\"ROLE_MANAGER\"]','$2y$13$Pin6sqSyIkHOl5O8NK/RL.ZkMG2UFBdFYs9ibMX82XYgxchX9jm0W','Sébastien','Reboul','Electrotechnicien',0,1,0,1,'','sebastien.reboul@carcassonne-agglo.fr2019120612432','0640466693','','mouhot@biotrade.fr',0,14,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-01 16:19:19','2022-02-25','Sr11eperf'),
(45,1,NULL,NULL,'TE','[\"ROLE_USER\"]','$2y$13$iPrJMRHFpHZ2hcfMaLPCtudwdl2kdCx5woKOv7ghMwOL1CUQE247y','Equipe','Travaux electro','electromecanicien',0,0,0,0,'','lionel.noulin@agglo-niort.fr20221216015808','','','mouhot@biotrade.fr',0,14,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-05 10:19:54','2021-08-15','Te79agglo'),
(47,1,NULL,NULL,'laurent-garravet@agg','[\"ROLE_USER\"]','$2y$13$L68EwTD7PisAWwnqJYaO4OX4DOFFuPnWELVwgVWHiSKAzPDGdxhWG','L.','G. Laboratoire','Laborentin',0,0,0,0,'','laurent-garravet@agglo-niort.fr20221107031625','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2023-11-21 16:11:43',NULL,'Lg79agglo'),
(48,1,NULL,NULL,'depan_electro','[\"ROLE_USER\"]','$2y$13$Ow3zdb2XGlXW8gFtnt7Q5.ryZ7SqE/JwkXpDyDRMxVNZm3vIfBz/G','Equipe','Depannage electro','electromecanicien',0,0,0,0,'','20221216015851','','','mouhot@biotrade.fr',0,14,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-05 10:13:00',NULL,'De79agglo'),
(49,1,NULL,NULL,'reseau','[\"ROLE_USER\"]','$2y$13$wxBLBMsT1UfWw6nfoxFG9OUxAEu3aazE5r0DfSukzg5sM.VZuCMT.','Equipe','Reseau HM','Exploitant reseau',0,0,0,0,'','herve.marsac@agglo-niort.fr20221107031718','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2022-09-23 14:50:25',NULL,'Res79agglo'),
(50,1,NULL,NULL,'CF','[\"ROLE_MANAGER\"]','$2y$13$iaWwXBDS8eAZA/QnFjfHt.tWosOP7ZlAE2E1vDoLjJESEEppGx4F2','C.','F. Chef de Maintenan','chef de maintenance',0,0,0,0,'','christophe.fortin@agglo-niort.fr20221107031727','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-01 17:15:26','2022-02-11','agglo79cf'),
(51,1,NULL,NULL,'MM','[\"ROLE_MANAGER\"]','$2y$13$YQjI4g5C.UesigxDAJPWR.KmtHdvvAnGqTjQwoW1zqErmKov12s1y','D.','L. Metrologie Mainte','Instrumentiste',0,0,0,0,'','damien.lefebvre@agglo-niort.fr20221107031804','','','mouhot@biotrade.fr',0,14,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-05 10:26:17','2022-03-10','DamiNath2006'),
(52,1,NULL,NULL,'CG','[\"ROLE_USER\"]','$2y$13$Ct2qRt10fzM7m5nwkK3RcehQuM5CPfbI5SgUqZKpymIZ5kRkCYv5W','Cyrille','G. Chef D\'exploitati','chef de regie',0,0,0,0,'','Cyrille.GONNORD@agglo-niort.fr20221107031903','0764393594','','mouhot@biotrade.fr',0,14,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-23 17:01:24',NULL,'CG79agglo'),
(53,1,NULL,NULL,'damien.perez@agglo-n','[\"ROLE_USER\"]','$2y$13$ya98tDbXITm7TjXXbZFii.tnKuQcqVqxoQWOJvKmRXXzYVKneu8tm','D.','P. Autosurveillance','Instrumentiste',0,0,0,0,'','damien.perez@agglo-niort.fr20221107031827','','','mouhot@biotrade.fr',0,7,'0;1;0;1',0,NULL,'0000-00-00 00:00:00','2024-02-05 10:05:59',NULL,'Dp79agglo'),
(54,1,NULL,NULL,'doris.haffoud@agglo-','[\"ROLE_USER\"]','$2y$13$G/jmpaWgyn70XPGcN.AUvuZi5K72PTClXhOcCBHMpGc/IxXbP3soq','Doris','Haffoud','chef de regie',0,0,0,0,'','doris.haffoud@agglo-niort.fr20210908100418','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2020-03-12 14:57:57',NULL,'Dh79agglo'),
(55,1,NULL,NULL,'LN','[\"ROLE_ADMIN\"]','$2y$13$Yc1DsIyYgp98QTiUGY9k/OkRiOL9yagneE2kSTAm/Mcx4Ml3NwbAK','L.','N. Automaticien','Automaticien',0,0,0,0,'','lionel.noulin@agglo-niort.fr20221216015737','0549044333','0683304026','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-23 11:32:38','2022-03-03','Zoul5796'),
(56,1,NULL,NULL,'didier.tirbois@agglo','[\"ROLE_USER\"]','$2y$13$Fiin9Z7/O2XWjurjmz6cXut7fzOZy7nJObvPPH5O/pTl4kkXNPbqy','D.','T. Administratif Etu','chef de regie',0,0,0,0,'','didier.tirbois@agglo-niort.fr20220307014302','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2022-11-17 16:45:58',NULL,'Dt79agglo'),
(57,8,NULL,NULL,'nicolas.azalbert@car','[\"ROLE_USER\"]','$2y$13$uq8OYmynHj7FKjpklldgYuXrrMnm3aHuenNDX3PuRYfw.dP1aAv5G','Nicolas','Azalbert','Cellule Travaux',0,0,0,0,'','nicolas.azalbert@carcassonne-agglo.fr2019102403104','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-19 08:11:15',NULL,'An11eperf'),
(58,8,NULL,NULL,'bertrand.barbis@carc','[\"ROLE_USER\"]','$2y$13$7C8WlLa9FSbaReeHyIrrS.RkGHIavz4eE6HjTaVV/G6pQCQFEL8Gi','Bertrand','Barbis','Cellule Travaux',0,0,0,0,'','bertrand.barbis@carcassonne-agglo.fr20191024031146','','','mouhot@biotrade.fr',0,14,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-17 12:23:54',NULL,'Bb11eperf'),
(59,8,NULL,NULL,'alexandre.semat@carc','[\"ROLE_MANAGER\"]','$2y$13$gkeQ/qqXfVBrFokX9BlUo.NLNhle/2MiSmH4YTDHElcf3UgU0iPJG','Alexandre','Semat','Gestionnaire stock',0,0,0,0,'','alexandre.semat@carcassonne-agglo.fr20191024031242','','','mouhot@biotrade.fr',0,14,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-02 10:40:31','2022-01-28','As11eperf'),
(60,8,NULL,NULL,'sebastien.bridot-tis','[\"ROLE_USER\"]','$2y$13$Vm6HnknFfFsJVr6dw1zRMehI.7EnysFzzH8l/9KlKJnLFAuNl1ouK','Sébastien','Bridot-Tissier','Agent travaux BT ',0,0,0,0,'','sebastien.bridot-tissier@carcassonne-agglo.fr20240','','','mouhot@biotrade.fr',0,14,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2023-09-27 16:47:49','2022-03-07','Sbt11eperf'),
(61,8,NULL,NULL,'david.bernard@carcas','[\"ROLE_USER\"]','$2y$13$2/ezzOzipnI5km1GsBzulu5BUymTbvLl4zDvrqTtnT7S2a3G8x1fa','David','Bernard','Agent d\'exploitation',0,0,0,0,'','david.bernard@carcassonne-agglo.fr20220615115821','','','mouhot@biotrade.fr',0,14,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-05 09:35:27','2022-02-14','Db11eperf'),
(62,8,NULL,NULL,'loic.bonnet@carcasso','[\"ROLE_MANAGER\"]','$2y$13$vukzsywLw5Q7ZxiK1xyUPO3jlYwFBiQgUNi3Uwrpo6RpONrAL4Bfm','Loïc','Bonnet','Agent d\'exploitation',0,0,0,0,'','loic.bonnet@carcassonne-agglo.fr20220914023745','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-05 09:16:18','2022-02-24','Lb12eperf'),
(63,8,NULL,NULL,'franck.canet@carcass','[\"ROLE_USER\"]','$2y$13$laEoPdFLDVvZKprWPuPxRuIpryG3YM2MD7edXK8yiEbByzugz8gXC','Franck','Canet','Agent d\'exploitation',0,0,0,0,'','franck.canet@carcassonne-agglo.fr20220615115848','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-05 10:26:21',NULL,'Fc11eperf'),
(64,8,NULL,NULL,'florent.gardet@carca','[\"ROLE_MANAGER\"]','$2y$13$6yyNAvCQmXK89DXe/hv1.eZlcSa47Qb70Zq5D3Gr65R30Xp1/v5d.','Florent','Gardet','Agent d\'exploitation',0,0,0,0,'','florent.gardet@carcassonne-agglo.fr20230914074718','06.45.73.37.53','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-02 17:28:40','2022-03-11','Fg11eperf'),
(65,8,NULL,NULL,'achraf.tahloul@carca','[\"ROLE_USER\"]','$2y$13$2ZxsGiaF.zuvr53GVJ8hoO1M/kYPz.oGkZatRTMrPQIAwJW4TYMBq','Achraf','Tahloul','Agent d\'exploitation',0,0,0,0,'','achraf.tahloul@carcassonne-agglo.fr20220615115912','','','mouhot@biotrade.fr',0,5,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-05 10:40:09','2022-03-03','At11eperf'),
(67,8,NULL,NULL,'christelle.sanchez@c','[\"ROLE_MANAGER\"]','$2y$13$PqTGP0OPiMme0QnYrZWd2OSjiTrkZCCvZ7Rn3R6DJCBlMC0eKlZgW','Christelle','Sanchez','Agent d\'exploitation',0,0,0,0,'','christelle.sanchez@carcassonne-agglo.fr20210916015','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-05 09:18:54','2022-02-10','Cs11eperf'),
(70,1000,NULL,NULL,'demo','[\"ROLE_ADMIN\"]','$2y$13$XBhjOjr/sZ18LQsaqLxAWudmcFjzaq2FHEimfAPIEXfjSwsWYrOlW','Responsable','Dupont','Responsable',0,0,0,0,'','goetschel@biotrade.fr20230824093840','','','mouhot@biotrade.fr',0,5,'1;1;0;1',0,NULL,'0000-00-00 00:00:00','2024-11-18 14:48:35','2022-03-03','biotrade'),
(71,1000,NULL,NULL,'martin2@biotrade.fr','[\"ROLE_USER\"]','$2y$13$Kfx64VYZqdlzkE9X5kIAUeLJLfoP9VZRZg2d58hMr4RJda0oNOKty','Exploitant','Martin','Agent d\'exploitation',0,0,0,0,'','martin2@biotrade.fr20200309084308','','','mouhot@biotrade.fr',0,7,'1;1;0;1',0,NULL,'0000-00-00 00:00:00','2020-03-06 10:02:14',NULL,'biotrade'),
(73,10,NULL,NULL,'decazeville','[\"ROLE_MANAGER\"]','$2y$13$vRPR4L65MgISZGe4nmEZvefCbU3tYaVSe/o95P.gWQncyBCB1DOu2','Prénom','NOM','Agent',0,0,0,0,'','decazeville20191219031424','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2022-03-11 10:42:22',NULL,'decazeville'),
(74,10,NULL,NULL,'l.baltrons','[\"ROLE_MANAGER\"]','$2y$13$rvI0qgSVgFd6iCePwTcmFuoWKTWs0WlabodFIqdiUmLd0pYNAK7fy','Laurent','Baltrons','Responsable',0,0,0,0,'','baltrons20191219031424','','','mouhot@biotrade.fr',0,14,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2023-09-21 11:45:03','2021-05-31','lBaltrons12'),
(75,10,NULL,NULL,'c.crespo','[\"ROLE_MANAGER\"]','$2y$13$yPBCTmIrrRrp6Bz5iixxquU3deNOq80ZjXdDZ13TDRTyoX0J/j5AW','Christophe','Crespo','Exploitant',0,0,0,0,'','crespo20191219031424','','','mouhot@biotrade.fr',0,14,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-30 09:54:45',NULL,'cCrespo12'),
(76,10,NULL,NULL,'l.naveaux','[\"ROLE_MANAGER\"]','$2y$13$fmah4OKMyLXFxNBcJSMknuwPZZsrCkD/vNj/wHEogQjkfksQnyV6m','Laurent','Naveaux','Exploitant',0,0,0,0,'','naveaux20191219031424','','','mouhot@biotrade.fr',0,14,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-31 16:36:07','2021-05-13','lNaveaux12'),
(77,10,NULL,NULL,'g.dalmon','[\"ROLE_MANAGER\"]','$2y$13$jTwbXbpo/42U9rdm/Y.VpO8PZk34xhirVdCbWk9UPXv9AKFD3ZcrS','Guillaume','Dalmon','Exploitant',0,0,0,0,'','dalmon20191219031424','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-05 08:31:47','2022-03-03','gDalmon12'),
(78,1,NULL,NULL,'exploitant_goilard','[\"ROLE_USER\"]','$2y$13$2e5yejtXGSxZNHa6lp.RCue0xPlVoAZ.4Td.fa5C5SwZ.xd1du/ra','Exploitant','Goilard','Exploitant STEP',0,0,0,0,'','20221107031913','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-31 08:36:08',NULL,'Go79agglo'),
(79,1,NULL,NULL,'exploitant_arcais','[\"ROLE_USER\"]','$2y$13$wv.Q6wyjRJ4kp.BJZpg/euudyPwMY2z5DMsfs.Jj3uX5FrTUEPX0.','Exploitant','Arcais Coulon','Exploitant STEP',0,0,0,0,'','20221107031920','','','mouhot@biotrade.fr',0,14,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-26 08:06:29',NULL,'Ar79agglo'),
(80,1,NULL,NULL,'exploitant_aiffres','[\"ROLE_USER\"]','$2y$13$N3opj4IhvyYhMi7STpQCiehVe16b0eMXXd7TGvZYFI82bYsxUjDmu','Exploitant','Aiffres ','Exploitant STEP',0,0,0,0,'','20221107031932','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-02 08:14:23',NULL,'Ai79agglo'),
(81,1,NULL,NULL,'exploitant_frontenay','[\"ROLE_USER\"]','$2y$13$SrBQ7v8p6ThCXOjTqL43puP2bM9UrDNGd4ZOfcFZQ0YjG8xkQ8z3y','Exploitant','Frontenay Mauzé','Exploitant STEP',0,0,0,0,'','20221107031943','','','mouhot@biotrade.fr',0,14,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-05 09:23:01',NULL,'Fr79agglo'),
(82,1,NULL,NULL,'exploitant_niort','[\"ROLE_USER\"]','$2y$13$R5QC90iGBHYXDxcjxJbRvuQblkHhGy8lc5TiDn/mJ/qkFyAI6hw0u','Exploitant','Niort ','Exploitant STEP',0,0,0,0,'','20221107031959','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-30 10:33:33',NULL,'Ni79agglo'),
(83,1,NULL,NULL,'exploitant_stgelais','[\"ROLE_USER\"]','$2y$13$NzTSjwnNs.fND6pbxrK87esv/7YMRubTW6DeRJ.IixCEsztQHgCO6','Exploitant','St Gelais Chauray','Exploitant STEP',0,0,0,0,'','20221107032010','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-24 16:39:44',NULL,'Ge79agglo'),
(84,8,NULL,NULL,'gregory.boyer@carcas','[\"ROLE_USER\"]','$2y$13$ZlB20y8sot/qL5Y9ovA2EuRN.FBYSa6kPNuWwhiR2ywBhcPX9tLoi','Grégory','Boyer','Agent d\'exploitation',0,0,0,0,'','gregory.boyer@carcassonne-agglo.fr20210217105306','06 37 27 15 62','','mouhot@biotrade.fr',0,14,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-02 10:24:45',NULL,'Gb11eperf'),
(88,17,NULL,NULL,'gtc@reseau31.fr','[\"ROLE_MANAGER\"]','$2y$13$felcaoN81CzBUB9sAgxpeuvosiW4J/yFo2keWXLJVErJjc2Tw9Mf2','Laurent','GTC','',0,0,0,0,'','gtc@reseau31.fr20210602092121','','','mouhot@biotrade.fr',0,5,'0;1;0;0',0,NULL,'0000-00-00 00:00:00','2024-02-05 10:31:57',NULL,'smea'),
(90,17,NULL,NULL,'philippe.calvet@rese','[\"ROLE_MANAGER\"]','$2y$13$z2lJ4nl2Kpp3CS9z5JrF..ARCK8oScsc4m0/PCEBUwW/wsDbG18za','Philippe','CALVET','',0,0,0,0,'','philippe.calvet@reseau31.fr20200224085656','','','mouhot@biotrade.fr',0,7,'0;1;0;1',0,NULL,'0000-00-00 00:00:00','2024-02-01 12:07:01',NULL,'smea'),
(93,12,NULL,NULL,'olivier.sauboy','[\"ROLE_MANAGER\"]','$2y$13$UBzTCok64nIJoEr6YCxac.uAIZ6mMXVNXe0v5XDIxLYY6n60p8kmy','Olivier','Sauboy','tvx reseau',0,0,0,0,'','technique@siaflt.fr20220502121959','','','mouhot@biotrade.fr',0,5,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-19 09:12:13','2022-02-17','siaflt'),
(94,12,NULL,NULL,'supervision@siaflt.f','[\"ROLE_ADMIN\"]','$2y$13$F/qGJXR4awxo2VijJrptH.Cu/2y7ebjVST7wLt7cWnVKoVn5gSdOm','Eric','Soulat','electrotechnicien',0,0,0,0,'','supervision@siaflt.fr20201109032145','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-01 08:44:15','2022-02-14','siaflt'),
(95,12,NULL,NULL,'siaflt.iddir@orange.','[\"ROLE_USER\"]','$2y$13$UNUAmcW/eExlfz1aXDdcR.6hCepN/5kpLFAOM51dkKv5WvddwurX2','Ismael','Iddir','tvx reseau',0,0,0,0,'','siaflt.iddir@orange.fr20220502121938','0682591729','','mouhot@biotrade.fr',0,14,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2022-08-22 08:29:03',NULL,'siaisma'),
(96,12,NULL,NULL,'siaflt.cbernadet@ora','[\"ROLE_USER\"]','$2y$13$YTZw5AxylbrE5JtA0/OnDOBJOs/HJh3npPK8.yM0TcNAaApKCk07i','Cédric','Bernadet ','electrotechnicien',0,0,0,0,'','siaflt.cbernadet@orange.fr20220502121746','0633194159','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-17 10:05:53',NULL,'siacb'),
(97,11,NULL,NULL,'auge.david','[\"ROLE_USER\"]','$2y$13$J7IqnTUXMJbKr97qN0BrxeM4pq82ujiKDJ.mVBJoK3fyEK.76IoBm','David','Auge','Réseaux',0,0,0,0,'','augeemo2020','','','mouhot@biotrade.fr',0,5,'1;0;0;1',0,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,'Da81eperf'),
(98,11,NULL,NULL,'brayette.damien','[\"ROLE_USER\"]','$2y$13$dVvDsJrHCZSrIOkqNpaiE.jg9zADDtbl2AdghkVQKhYILSy8flapy','Damien','Brayette','Réseaux',0,0,0,0,'','brayettedemo2020','','','mouhot@biotrade.fr',0,5,'1;0;0;1',0,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,'Db81eperf'),
(101,11,NULL,NULL,'escande.jeremy','[\"ROLE_USER\"]','$2y$13$PRcoo.5CtZ7.KTgck1bb/Odc5YubVvcEZh3jR1gTQM1snt5X46tRe','Jérémy','Escande','Réseaux',0,0,0,0,'','Escandedemo2020','','','mouhot@biotrade.fr',0,5,'1;0;0;1',0,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,'Je81eperf'),
(102,11,NULL,NULL,'bernard.henri','[\"ROLE_USER\"]','$2y$13$L5SJza1VM45PLZVbY/YXRe.FZxCME3ElQI83LR7P/2NsS/q.DMHJ6','Henri','Bernard','Maintenance',0,0,0,0,'','Bernardhdemo2020','','','mouhot@biotrade.fr',0,5,'1;0;0;1',0,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,'Hb81eperf'),
(103,11,NULL,NULL,'granier.denis','[\"ROLE_USER\"]','$2y$13$mbzpKSPkw66VVryPufteWOHXamYJpU.Q3dMcGNaKgOUtbfFhAfojK','Denis','Granier','Maintenance',0,0,0,0,'','Granierdemo2020','','','mouhot@biotrade.fr',0,5,'1;0;0;1',0,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,'Dg81eperf'),
(104,11,NULL,NULL,'lazaro.joaquim','[\"ROLE_USER\"]','$2y$13$SbHiAwkdc.XEfPmUBOYNM.ZBbUYTQ3hNfgK8TIagIY8olJ/fC3hXi','Joaquim','Lazaro','Maintenance',0,0,0,0,'','j.lazaro.rceac@orange.fr20210311035718','','','mouhot@biotrade.fr',0,5,'1;0;0;1',0,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,'Jl81eperf'),
(105,11,NULL,NULL,'zivot.sebastien','[\"ROLE_USER\"]','$2y$13$w9XMRbzCnFfb7BiOcWjEBuLDTwZHsPzpBW/NJsXQu/0wE6a6QFck6','Sébastien','Zivot','Maintenance',0,0,0,0,'','s.zivot.rceac@orange.fr20210311035646','','','mouhot@biotrade.fr',0,14,'1;0;0;1',0,NULL,'0000-00-00 00:00:00','2024-01-31 11:15:11',NULL,'Sz81eperf'),
(107,11,NULL,NULL,'castagne.lionel','[\"ROLE_MANAGER\"]','$2y$13$YVitb39uiM2Hxlg.N1MLAODpcezeLZXucySlWwy83jjKMzJ8UrIqq','Lionel','Castagne','Maintenance',0,0,0,0,'','lionel.castagne@rceac.fr20210915024910','','','mouhot@biotrade.fr',0,14,'1;0;0;1',0,NULL,'0000-00-00 00:00:00','2024-02-02 08:36:56','2022-03-03','Lc81eperf'),
(108,11,NULL,NULL,'bernard.marielle','[\"ROLE_MANAGER\"]','$2y$13$yRHBZEfZvRPXO0FJSJlSpO3Xva/FKdlFp2S4gp8zsoNM8qxFeHZ7y','Marielle','Bernard','Administratif',0,0,0,0,'','Bernardmdemo2020','','','mouhot@biotrade.fr',0,5,'1;0;0;1',0,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,'Mb81eperf'),
(109,11,NULL,NULL,'landry.charles','[\"ROLE_MANAGER\"]','$2y$13$9.fsJACIvkSTsRpHr22y3.rWpXnVIp3m0FNa9.4aaXk4BnegarAVO','Charles','Landry','Administratif',0,0,0,0,'','Landrydemo2020','','','mouhot@biotrade.fr',0,5,'1;0;0;1',0,NULL,'0000-00-00 00:00:00','2023-04-19 09:05:03','2022-01-14','Cl81eperf'),
(110,11,NULL,NULL,'uruty.grace','[\"ROLE_MANAGER\"]','$2y$13$wOGl/qryGi0gh5auhRaMveomzYtZcdOivS6n9jPQLfI21JWdV4J5e','Grace','Uruty','Administratif',0,0,0,0,'','Urutydemo2020','','','mouhot@biotrade.fr',0,5,'1;0;0;1',0,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,'Gu81eperf'),
(111,12,NULL,NULL,'controle@siaflt.fr','[\"ROLE_USER\"]','$2y$13$Exxegrja0WzFVEufgFQC0Ou2YaRPi4dQFH9gD3I1FcnKbAyGU7Ws6','Quentin','Bunouf','devis',0,0,0,0,'','controle@siaflt.fr20220427022954','0684829594','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2023-11-30 15:47:58',NULL,'!Spanc.quent1n%'),
(112,12,NULL,NULL,'marchespublics@siafl','[\"ROLE_MANAGER\"]','$2y$13$IfreL1pk1OQ8ajh1jtfgLurxp6a1hjhvvCsfzKBXJ7oaCwKEWzfwe','Emmanuelle','Maurat','',0,0,0,0,'','marchespublics@siaflt.fr20200305105006','0679444566','0556639402','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-25 11:42:23','2021-11-01','Directrice'),
(113,12,NULL,NULL,'cd.siaflt@orange.fr','[\"ROLE_USER\"]','$2y$13$Ovjr.YZkA60WGcTEFnwXfOMk3Qi6oZQdyDsIckRlq8OfXxdaFww2W','Cédric','Dutemps','electrotechnicien',0,0,0,0,'','cd.siaflt@orange.fr20220502121807','0687832188','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-02 20:58:06',NULL,'12345'),
(114,12,NULL,NULL,'ml.siaflt@orange.fr','[\"ROLE_USER\"]','$2y$13$jJe6EQX3Poqhqi./IbgQSuNIwSU4kfY3DuAVOkIaUeYs9KbxeLrbW','Michael','Larrue','tvx reseau',0,0,0,0,'','ml.siaflt@orange.fr20220502122036','0688233641','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2022-11-24 14:51:29',NULL,'siaisml'),
(115,12,NULL,NULL,'jls.siaflt@orange.fr','[\"ROLE_USER\"]','$2y$13$.dQq9VF8KGtPeBaSxNtm/eikWqNkVl8CB7t/AX8PHtXAEcGxFsBbG','Julien','Grellety','tvx reseau',0,0,0,0,'','jls.siaflt@orange.fr20230308082657','0649072728','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2022-08-22 13:35:38',NULL,'siaisjls'),
(116,9,NULL,NULL,'dev_biotrade','[\"ROLE_MANAGER\"]','$2y$13$IC8L.P2RfyBMpCPCLvUWJuKCHNCxum7Btyj0ejO7m1032.EssfMSa','dev','dev','Développeur ePerf',0,0,0,0,'1,2,5,7,8,9,10,11,13,15,26,27','dev_bitoradefoix','06 20 01 03 65','05 61 14 69 53','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2023-06-22 13:24:44',NULL,'foix'),
(117,1002,NULL,NULL,'sandre','[\"ROLE_MANAGER\"]','$2y$13$JFTs278dM6dRDgtnvKpzxOTEtnw2mvIPZ2Iu0abPfiid7h4SndFCK','Mathieu','POCQUET','Développeur ePerf',0,0,0,0,'1,2,5,7,8,9,10,11,13,15,26,27','sandre@biotrade.fr20190722091133','06 20 01 03 65','05 61 14 69 53','mouhot@biotrade.fr',0,7,'0;1;1;1',0,NULL,'0000-00-00 00:00:00','2021-01-20 14:48:39','2021-02-20','sandre'),
(118,12,NULL,NULL,'permance.siaflt@oran','[\"ROLE_USER\"]','$2y$13$Ge0muppJ1XyA/4atIkp8d.tFCmS8nTZehkdXLMO85YrwnEUcUYTIa','astreinte','permanence','tvx reseau',0,0,0,0,'','permanece.siaflt@orange.fr20220502122110','0682591730','','mouhot@biotrade.fr',0,14,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-01 16:41:09',NULL,'!SIAdeFLT!'),
(119,12,NULL,NULL,'contact@siaflt.fr','[\"ROLE_USER\"]','$2y$13$SG44FnG5CR2fwaCzfvTXUOUjcN5kuFIGr44KyeuhRaZXl0v0aH9Sm','service','bureau','',0,0,0,0,'','contact@siaflt.fr20200624100922','0556633795','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-31 09:38:04',NULL,'!SIAdeFLT!'),
(128,1004,NULL,NULL,'data','[\"ROLE_MANAGER\"]','$2y$13$9Aa5h3mxEJashcBblRYn3uN81oQF0GH5pK2k62x930FARTtS1vEzi','DATA','DATA','',0,0,0,0,'','data20201027122814','','','mouhot@biotrade.fr',0,7,'0;1;0;1',0,NULL,'0000-00-00 00:00:00','2023-05-10 09:14:42','2021-02-18','data'),
(129,1005,NULL,NULL,'dataniort','[\"ROLE_MANAGER\"]','$2y$13$nzY9woP5.nexN92Nxa.G1.XD8ccPMN8Kdm9Rd1MasCFdRc7WOnz42','DATA','DATA','',0,0,0,0,'','data20201027122825','','','mouhot@biotrade.fr',0,7,'0;1;0;1',0,NULL,'0000-00-00 00:00:00','2021-12-09 15:10:19','2020-11-21','data'),
(131,14,NULL,NULL,'nicolas.tena','[\"ROLE_ADMIN\"]','$2y$13$ikdyJqTuRrRXzlXd2J2SwOLfganYgR.idknyOJ98qKjMpO.K7U62G','Nicolas','TENA','DGA DSI',0,0,0,0,'','nicolas.tena@sivom-sag.fr20220408094136','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-15 15:00:56','2021-11-05','Biotrade2021!'),
(133,14,NULL,NULL,'anne.dupuy','[\"ROLE_USER\"]','$2y$13$PZNa.IdGmFOSoYqSABmq8.G3GRF2FOiNYTUIjzorAupuNkfizbo5S','Anne','DUPUY','DGA DTEPP',0,0,0,0,'','anne.dupuy@sivom-sag.fr20230407023427','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2021-06-16 14:08:52','0000-00-00','BqkPItwj'),
(135,14,NULL,NULL,'delphine.moncuy','[\"ROLE_USER\"]','$2y$13$zL7YQ33tsmLRUEAs/rJOa.1ehqOYCkZLB2kPyEsAkNv9pkGXd.lRe','Delphine','MONCUY','Resp. Ouvrage et Process',0,0,0,0,'','delphine.moncuy@sivom-sag.fr20220408094214','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-15 16:25:12','0000-00-00','SRmx1A39'),
(136,14,NULL,NULL,'celine.torres','[\"ROLE_USER\"]','$2y$13$U4tV/4GJUHXjFxVfrSwDzeJMNrhJjGAY0RQMBbEWnAyfhfgMrElDa','Céline','TORRES','Resp. d\'Exploitation Adjoint',0,0,0,0,'','celine.torres@sivom-sag.fr20231130091746','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2023-12-19 11:33:59','0000-00-00','UXfqih5U'),
(138,14,NULL,NULL,'jeanpierre.grauby','[\"ROLE_USER\"]','$2y$13$S7U2yKaqPOVcFPxSbIMKe.eOJbSI/tEyixp2WFrFTuznvC/2Di442','Jean-Pierre','GRAUBY','DGA Pôle Ariège',0,0,0,0,'','jeanpierre.grauby@sivom-sag.fr20220408095205','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2021-08-26 15:32:37','0000-00-00','tBOxYzOQ'),
(141,14,NULL,NULL,'jerome.chene','[\"ROLE_USER\"]','$2y$13$MANJOlOiofxm9tSNqGGroeg05tH/eorT2UdCiEcpSTD2lw7T3RHYW','Jérôme','CHENE','Agent d\'Exploitation',0,0,0,0,'','uep.ariege@sivom-sag.fr20210323093418','0784525922','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2023-10-24 11:07:35','0000-00-00','BljvB364'),
(142,14,NULL,NULL,'jerome.vidal','[\"ROLE_USER\"]','$2y$13$E3aiCr9ptucVbjUOxmoxeeIMffre5BAclAnBfh.SRqykg7Mz6DpYu','Jérôme','VIDAL','Agent d\'Exploitation',0,0,0,0,'','uep.ariege@sivom-sag.fr20210830084119','','','mouhot@biotrade.fr',0,14,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-02 17:24:36','0000-00-00','FUCDurtW'),
(143,14,NULL,NULL,'frederic.fourcade','[\"ROLE_MANAGER\"]','$2y$13$kUVdQNaCKSlaM8n41yv.CuJj2OIFBuPIyY/Dy7JgEw3bI8buWxcvq','Frédéric','FOURCADE','Resp. Gestion Patrimoniale des',0,0,0,0,'','frederic.fourcade@sivom-sag.fr20220408094312','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00','0000-00-00','BSpmj22J'),
(144,14,NULL,NULL,'leo.vicente','[\"ROLE_USER\"]','$2y$13$KIxe71NglaiRb8RZ1e4jvu1e7wprgeITtFh5FbhaEiJUiSA6QeIVK','Léo','VICENTE','Chargé de la Recherche de Fuit',0,0,0,0,'','leo.vicente@sivom-sag.fr20220408094335','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2022-11-21 10:39:37','0000-00-00','U8r3k3VV'),
(145,14,NULL,NULL,'jeanbaptiste.etchepa','[\"ROLE_USER\"]','$2y$13$rrQgXya07E.vP384tCZ9HudAc34k5R5mj6WZzTRCJ57ScolL6crQ6','Jean-Baptiste','ETCHEPARE','Resp. d\'Exploitation',0,0,0,0,'','jeanbaptiste.etchepare@sivom-sag.fr20220408095234','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00','0000-00-00','peq0ix5Y'),
(146,14,NULL,NULL,'nicolas.martinez','[\"ROLE_USER\"]','$2y$13$1NbyE2djl.u/RKoI.7c2oepXHCSWjCD7Yp15zPmk9StRNghyueMsW','Nicolas','MARTINEZ','Resp. d\'Exploitation Adjoint',0,0,0,0,'','nicolas.martinez@sivom-sag.fr20220408095251','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00','0000-00-00','sIBX95UL'),
(147,14,NULL,NULL,'sandrine.catalan','[\"ROLE_MANAGER\"]','$2y$13$vgqJHf35gq8po3GU3bvyYeJ0tfiSeRNT0m6Fb/CkrrliHqy1xbKbq','Sandrine','CATALAN','DGA Pôle Saudrune',0,0,0,0,'','sandrine.catalan@sivom-sag.fr20220408095305','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2021-10-21 14:07:59','2021-11-07','Xj8hla0f'),
(149,14,NULL,NULL,'anthony.berou','[\"ROLE_MANAGER\"]','$2y$13$m8YF28yaKUx4Ls5Vsro5IOekEkK0ie7W6QidIctP2f3s1IQ2QzS2i','Anthony','BEROU','Chef d\'équipe STEU',0,0,0,0,'','anthony.berou@sivom-sag.fr20210826123511','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-30 16:12:55','2022-03-03','uZVNx1L0'),
(150,14,NULL,NULL,'samuel.lautre','[\"ROLE_USER\"]','$2y$13$0BGI5jHUoIYiG9vhPR1ai.Jb01nr/0nTq/Q9SrMtWgYrz6CxNzKQG','Samuel','LAUTRE','Agent d\'Exploitation',0,0,0,0,'','exploitation.saudrune@sivom-sag.fr20210624084135','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-01 16:37:20','0000-00-00','KmXTsRFp'),
(151,14,NULL,NULL,'alexis.laurent','[\"ROLE_USER\"]','$2y$13$KcVeGlMi522992NuqARiOuubgGAXJ.wr8pwRbyGK72ReG68gFZ0Ta','Alexis','LAURENT','Agent d\'Exploitation',0,0,0,0,'','exploitation.louge@sivom-sag.fr20220408094436','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-02 12:04:51','0000-00-00','bNHxYHNh'),
(152,14,NULL,NULL,'gregory.woskala','[\"ROLE_USER\"]','$2y$13$pQgz9r6aZqkCwdLOHCG4PObdVvaO8X4Njw1oo3yVNyarQVUnriKCG','Grégory','WOSKALA','Agent d\'Exploitation',0,0,0,0,'','exploitation.saudrune@sivom-sag.fr20220518120157','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-01 09:21:11','0000-00-00','96UFmtAQ'),
(153,14,NULL,NULL,'julien.morisseau','[\"ROLE_MANAGER\"]','$2y$13$Oi0C24UxmCAJtOx2cvLB4egjgJ.75hBEk88Y2nEIVgYEodLgk2fkW','Julien','MORISSEAU','Chef d\'équipe',0,0,0,0,'','julien.morisseau@sivom-sag.fr20231213040048','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-31 10:24:59','0000-00-00','swD0yo0i'),
(154,14,NULL,NULL,'pascal.koeninger','[\"ROLE_USER\"]','$2y$13$5rWgBLg0qsiSb3pRRXs3QO2WVXZ.UWdUl5gZvWpC5FkS80VM14gUW','Pascal','KOENINGER','Agent d\'Exploitation',0,0,0,0,'','exploitation.saudrune@sivom-sag.fr20211005072812','','','mouhot@biotrade.fr',0,5,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-05 09:07:24','0000-00-00','LYcePRE1'),
(155,14,NULL,NULL,'nicolas.mollis','[\"ROLE_USER\"]','$2y$13$k/F8iQTUo3l3w7Bocmvt2.clfsVyujhfEcwYO8rGct/IVRPD7VagO','Nicolas','MOLLIS','Agent d\'Exploitation',0,0,0,0,'','exploitation.saudrune@sivom-sag.fr20210826123553','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-02 14:31:26','0000-00-00','ElyC3lTd'),
(156,14,NULL,NULL,'geraldine.sleizak','[\"ROLE_MANAGER\"]','$2y$13$Yk0Vw3Z.2scFqcYDtVFX1uxdfVXc9lpxGY.i8TEw4gFOWPEi.7HtO','Géraldine','SLEIZAK','DGA Pôle Lèze',0,0,0,0,'','geraldine.sleizak@sivom-sag.fr20220408095435','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2021-10-06 11:16:18','2021-10-02','rOSNhtEJ'),
(158,14,NULL,NULL,'simon.olivier','[\"ROLE_MANAGER\"]','$2y$13$1qAt.4hcQI.ju9n3Aq8Io.rMgzLO9N7/a4h7W6ngZV1MBI8mg77ZW','Simon','OLIVIER','Resp. d\'Exploitation',0,0,0,0,'','simon.olivier@sivom-sag.fr20230703011702','','','mouhot@biotrade.fr',0,14,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-29 13:07:07','2021-11-05','I3GyUlzz'),
(159,14,NULL,NULL,'matthieu.martin','[\"ROLE_USER\"]','$2y$13$xGT53LhdC.FKkjcMWAltu.B8IRtin3jA.2yYfXkZRsBDg9vfVXcba','Matthieu','MARTIN','Electromécanicien',0,0,0,0,'','matthieu.martin@sivom-sag.fr20220408094524','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2022-11-28 14:03:34','0000-00-00','G8bJt5WV'),
(160,14,NULL,NULL,'valentin.doussin','[\"ROLE_USER\"]','$2y$13$vPbNtcbnFEZDCKIX5eVFV.W8FRFn/Z4ePuVeliOtiig/wCG3zln8.','Valentin','DOUSSIN','Electromécanicien',0,0,0,0,'','valentin.doussin@sivom-sag.fr20220408094608','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-02 16:21:35','0000-00-00','TPJainUj'),
(162,14,NULL,NULL,'fethi.bachirbey','[\"ROLE_USER\"]','$2y$13$n8d46.VPBIChJ.EkgOMI5O2A0rDqY5SYkhSD9eiCA82EeEwaKTL8.','Féthi','BACHIR-BEY','Agent d\'Exploitation',0,0,0,0,'','fethi.bachirbey@sivom-sag.fr20220408094722','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2023-03-08 16:56:26','0000-00-00','MwHGRhfx'),
(163,14,NULL,NULL,'fabien.lagarde','[\"ROLE_USER\"]','$2y$13$6bQbNHxgTU/MyyVaxpgSvOjt.1NfL0Gy5fPk.5YiwjalaSruX9D5W','Fabien','LAGARDE','Agent d\'Exploitation',0,0,0,0,'','LAGARDE202012220952','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2021-12-16 15:16:16','0000-00-00','prhSxdOq'),
(164,14,NULL,NULL,'frederic.bonnes','[\"ROLE_MANAGER\"]','$2y$13$EFW23BoV6Lq0n.Ccq.J9f.Oujt6ksBialVUjuDi9Wn6vyTbTQPYka','Frédéric','BONNES','DGA Pôle Louge',0,0,0,0,'','frederic.bonnes@sivom-sag.fr20220408094801','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2023-07-13 11:57:13','0000-00-00','2xBlVwEA'),
(167,14,NULL,NULL,'patrick.camboulives','[\"ROLE_USER\"]','$2y$13$fN0VN7NxwYXneVdHpeOUae3Gx8xigq32YQTKppkqhGKpOJa5c6cp2','Patrick','CAMBOULIVES','Agent d\'Exploitation',0,0,0,0,'','exploitation.louge@sivom-sag.fr20220408094836','','','mouhot@biotrade.fr',0,14,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-08 14:35:10','0000-00-00','pZ1WcPnf'),
(168,14,NULL,NULL,'joris.llorens','[\"ROLE_MANAGER\"]','$2y$13$vmUI7HokTBtH9rKEsSgVXuffasm2QkdXuckUD65QqaJlZIeNxihYu','Joris','LLORENS','Electromécanicien',0,0,0,0,'','joris.llorens@sivom-sag.fr20220408094913','','','mouhot@biotrade.fr',0,14,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-31 14:07:45','2022-02-12','nZBivfSG'),
(169,14,NULL,NULL,'florent.lavergne','[\"ROLE_USER\"]','$2y$13$hwhfdmc2VTc0EA6JuhnhWekH5Xd5xikLeCo2jcTnFZLdCfcC8aq/y','Florent','LAVERGNE','Agent d\'Exploitation',0,0,0,0,'','exploitation.louge@sivom-sag.fr20220408094934','','','mouhot@biotrade.fr',0,14,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2023-01-13 11:16:38','0000-00-00','MQh1C13W'),
(170,14,NULL,NULL,'eric.bressolles','[\"ROLE_USER\"]','$2y$13$5MnZiS8H0MIw72x8MAZXaOM./VjFatIwf1G/1joUoJZqVuF.Cq8Zq','Eric','BRESSOLLES','Agent d\'Exploitation',0,0,0,0,'','eric.bressolles@sivom-sag.fr20220408094958','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-31 09:10:22','0000-00-00','udg7q3iz'),
(171,14,NULL,NULL,'astreinte.cadre','[\"ROLE_USER\"]','$2y$13$JsZEQOiqLdX5mX/Jq3HgmumAIuv6MgevvccNrnPt7n2FRyFGbpOCi','Cadre','ASTREINTE','Astreinte',0,0,0,0,'','ASTREINTE202012220952','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2021-03-18 09:48:33','0000-00-00','Om51btgz'),
(172,14,NULL,NULL,'astreinte.technique1','[\"ROLE_USER\"]','$2y$13$T5Yk3oOPE8uIBTzugTeOo.nTqUADL9p0/uLa9snzbMAVmE0hm/Cjm','Technique 1','ASTREINTE','Astreinte',0,0,0,0,'','ASTREINTE202012220952','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00','0000-00-00','sSRX8KEU'),
(173,14,NULL,NULL,'astreinte.technique2','[\"ROLE_USER\"]','$2y$13$8fU7ytrWJ61BVPUFcQF0w.9d9vXm6urgtjdXu6VkYjWDXfI5Z53l2','Technique 2','ASTREINTE','Astreinte',0,0,0,0,'','ASTREINTE202012220952','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00','0000-00-00','AWWdYZ9r'),
(174,14,NULL,NULL,'astreinte.uep','[\"ROLE_USER\"]','$2y$13$C3PYvAkC.5syTDDOhfOQMuKmToHCIpyMoRH.8rF4wu8YaD7lenPqG','Uep','ASTREINTE','Astreinte',0,0,0,0,'','ASTREINTE202012220952','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2020-12-22 11:21:35','0000-00-00','LgDv4YET'),
(181,17,NULL,NULL,'laurent.ibanez@resea','[\"ROLE_MANAGER\"]','$2y$13$cUpCHANi..mUAQJrfxL3tONZtSBbEDAnFoYJkyhR2X3je3UdGfeVG','Laurent','IBANEZ','',0,0,0,0,'','laurent.ibanez@reseau31.fr20200224085656','','','mouhot@biotrade.fr',0,7,'0;1;0;1',0,NULL,'0000-00-00 00:00:00','2023-03-08 10:53:06',NULL,'smea'),
(183,25,NULL,NULL,'demo_eperf','[\"ROLE_ADMIN\"]','$2y$13$mh3xH9e6oUjIX6B/O69fvuprN0M3dwMEfVCpMLrj32614XiDzPs0e','Agent','Démo','Responsable',1,1,1,1,'','20231221025129','','','mouhot@biotrade.fr',0,5,'1;0;0;1',0,NULL,'0000-00-00 00:00:00','2024-10-24 21:20:28','2021-12-31','eperf!'),
(184,16,NULL,NULL,'g.madec','[\"ROLE_ADMIN\"]','$2y$13$qV3PQ73GlVpxBtEsFyz.1uW8lhoeeLAv4k7Z3M/s8Q802q4lAMZIG','adm','Administratif','Responsable d\'Exploitation',1,0,0,0,'','sea-etude3@clcl.bzh20221006115211','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-05 09:20:05','2022-03-12','gmadec@ep16'),
(185,16,NULL,NULL,'reseaux.lesneven','[\"ROLE_USER\"]','$2y$13$G0VUpUpjmaoRvZrGOm5fv.LkFM7DNTwoQCBDBWG.7R8hboBbbMnOi','res','Réseau','Chef d\'équipe STEU',1,0,0,0,'','sea-etude3@clcl.bzh20230621012918','0758247557','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-05 09:47:32','2021-05-13','reseaux@ep16'),
(186,16,NULL,NULL,'step.lesneven','[\"ROLE_MANAGER\"]','$2y$13$IFrYCYWyUkNuT17Gyc78VeMI6GVrxFxRvrk.78.hjX3h6I6QGPbaG','Ouvr','Ouvrage','DGA DSI',1,0,0,0,'','20210603114941','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-02 15:51:15','2022-03-17','step@ep16'),
(187,2000,NULL,NULL,'mguilbaud','[\"ROLE_MANAGER\"]','$2y$13$cY78Gm2mxOhFz3lr0rZCDOdcpsGbYchkdjzd3iNYujJ52vtsxMFlq','Marion','Guilbaud','Responsable',0,0,0,0,'','guilbaud@biotrade.fr20200130104206','','','mouhot@biotrade.fr',0,5,'1;1;0;1;1',0,NULL,'0000-00-00 00:00:00','2021-08-23 14:36:25','2021-06-25','spanc'),
(188,14,NULL,NULL,'timothee.blaise','[\"ROLE_MANAGER\"]','$2y$13$pjdUYN3rhIj9gw1g.vkPku8Idx41FNnsiyLPwBfww3wMPUID06gBS','Timothée','BLAISE','Resp. d\'Exploitation',0,0,0,0,'','20230510025154','','','mouhot@biotrade.fr',0,14,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-02 15:16:10','2022-02-12','K6cWr8HA'),
(189,14,NULL,NULL,'khalid.elbalhoul','[\"ROLE_USER\"]','$2y$13$2.Z5O.WcFD/6xAtVKD5zeOFXmfi64dSU2z5IKBa807fNbcjn7ZXB.','Khalid','EL BALHOUL','Agent d\'Exploitation',0,0,0,0,'','20210610072238','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-02 15:00:18',NULL,'U6y1k4RW'),
(192,1,NULL,NULL,'sc','[\"ROLE_MANAGER\"]','$2y$13$yIww5OHj7pkkCG1tx4PUNOBUj/uxn/HJtMg8r7zqcnGN2UU8uIQqS','SEBASTIEN','CIEREN','electromecanicien',0,0,0,0,'','scieren.can79@outlook.fr20210805070038','0669649850','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2023-09-12 18:31:17','2021-11-06','220782Sc'),
(193,2003,NULL,NULL,'sforato','[\"ROLE_MANAGER\"]','$2y$13$0Cgl4Hzf9EpHauATDa5qW.WjrQiND16LKfrsDz1r4t0y9n8a0.0yK','Serge','FORATO','',0,0,0,0,'','20220413011550','','','mouhot@biotrade.fr',0,5,'1;1;0;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-05 08:46:20','2021-11-14','Sf11spanc!'),
(194,8,NULL,NULL,'vincent.mot@carcasso','[\"ROLE_USER\"]','$2y$13$F4sbqa1mWyy2chzA664xPOcOO9kzJdG91LdvArHlPHmPFRqqUDhJq','Vincent','MOT','Agent d\'exploitation',0,0,0,0,'','vincent.mot@carcassonne-agglo.fr20230810044809','0786038000','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-04 07:59:43','2021-11-27','MV11eperf'),
(195,8,NULL,NULL,'gerald.barthelemy@ca','[\"ROLE_MANAGER\"]','$2y$13$Lqzz0ip53CcWwwhyo.90EuV17xUDVgCMJIWNv0fKmBWkNqOlBYNQ.','Gérald','BARTHELEMY','Agent d\'exploitation',0,0,0,0,'','gerald.barthelemy@carcassonne-agglo.fr202311020809','0631645588','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-01 07:18:51','2022-03-07','BG11eperf'),
(196,14,NULL,NULL,'aude.jaquillard','[\"ROLE_USER\"]','$2y$13$To6I5s5rojHgQ89c.98kXuB.cx8fP0vYacwBZWZT4Q6c9cqlSpDKa','Aude','JAQUILLARD','Resp. Infrastructures Hydrauli',0,0,0,0,'','aude.jaquillard@sivom-sag.fr20230706024925','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2023-06-20 10:09:01',NULL,'GuM74n4o'),
(197,14,NULL,NULL,'fabien.thomas','[\"ROLE_USER\"]','$2y$13$kmbKR3ML8s2YLGBx2rhpK.qndk7armPT3lTwRRLDdmuOh1vzlHbte','Fabien','THOMAS','Agent d\'Exploitation',0,0,0,0,'','20221014114307','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2023-12-08 08:41:17',NULL,'bKCa23XJ'),
(198,14,NULL,NULL,'frederic.bauer','[\"ROLE_USER\"]','$2y$13$c2dsHRrqPiDVAT6HTrmVpORksKv3q2UV4Ce98snIGpwKGuILfZ5T.','Frédéric','BAUER','Agent d\'Exploitation',0,0,0,0,'','frederic.bauer@sivom-sag.fr20220408095146','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2021-10-28 16:57:05',NULL,'3hHgRp95'),
(199,14,NULL,NULL,'marie.clergue','[\"ROLE_USER\"]','$2y$13$dxZBGuFGImWDrNCaqAXGMer3M9QfvI0JS4gBqVJnxWOrSTa9zFl4q','Marie','CLERGUE','Agent d\'Exploitation',0,0,0,0,'','20210901092503','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-30 14:36:42',NULL,'2KzG6a5s'),
(201,1,NULL,NULL,'SE','[\"ROLE_USER\"]','$2y$13$R07L8VIwogKcNyp0GXLO0.ZFbNsAS5YRy9MsYAaRrpS.Z0oqV9h0S','Equipe','Serruriers Soudeurs','serrurier',0,0,0,0,'','Freddy.moreau@agglo-niort.fr20211105125732','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-31 08:45:47',NULL,'Se79agglo'),
(203,14,NULL,NULL,'nicolas.test','[\"ROLE_USER\"]','$2y$13$/ecoShQUy4vToyAz1P9mgusemIwpO1vEszWg2wJmamgtVjg7ijGPS','Nicolas','TEST','DGA DSI',0,0,0,0,'','20220509081405','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2022-05-09 14:54:21',NULL,'Biotrade2021!'),
(213,1000,NULL,NULL,'ludo','[\"ROLE_MANAGER\"]','$2y$13$NWyD8HpMjyDGKg2m2ISkFeDAn4jk8RWSMvnRuGAWoyCPqG0MN45xa','ludovic','gestionnaire','Responsable',0,0,0,0,'','20220419012822','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,'2511'),
(214,11,NULL,NULL,'portale.yannick','[\"ROLE_USER\"]','$2y$13$vQO6tBIqGIVm.0sRf6RRle7q0geBcR1SyC6l5ZIMlIToFlN3rQG.e','Yannick','PORTALE','Maintenance',0,0,0,0,'','yannick.portale@rceac.fr20221220023932','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-31 10:40:51',NULL,'Py81eperf'),
(215,2002,NULL,NULL,'saur_montau','[\"ROLE_MANAGER\"]','$2y$13$aM/R4hBlhyg3UvoBQz3JHe7cy790ZuJaYBQIRX1RHcVP74.ae/gP.','Saur','Saur','Responsable',0,0,0,0,'','saurmontaud@biotrade.fr20200130104206','','','mouhot@biotrade.fr',0,5,'1;1;0;1;1',0,NULL,'0000-00-00 00:00:00','2023-12-05 11:55:27','2021-11-14','saur'),
(217,2,NULL,NULL,'savbiotrade','[\"ROLE_ADMIN\"]','$2y$13$UrK0XWag0RDa6JWMY7crCugBcNJUAhlafWM3.kADyXHs6WTDJ4Pea','Team','SAV','',0,0,0,0,'','azzola1@biotrade.fr20220121111715','06 52 33 76 98','','mouhot@biotrade.fr',0,5,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2023-07-18 12:15:07','2022-03-17','Sav31120!'),
(218,2001,NULL,NULL,'eperfspanc','[\"ROLE_MANAGER\"]','$2y$13$QJSKYUPUVXY7JyVNMOmG5Os96QE1epwXq1iLAyB4pGTrhXdZ2bAoe','Serge','Spanc','Serge',0,0,0,0,'','','','','mouhot@biotrade.fr',0,5,'1;1;0;1;1',0,NULL,'0000-00-00 00:00:00','2023-08-08 16:29:13','2021-11-14','spanc'),
(219,1,NULL,NULL,'STEP','[\"ROLE_USER\"]','$2y$13$5TRkxk2ht.qRZD/x3BHaJu0hkz1PeFfaQ0CPP5xq0JedheS.yOkHu','Mathieu','B. chef STEP','Chef Exploitant',0,0,0,0,'','mathieu.bony@agglo-niort.fr20220307014746','0633077094','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-29 10:00:00',NULL,'STEP79'),
(220,1,NULL,NULL,'thibaut.gallut@agglo','[\"ROLE_USER\"]','$2y$13$cbgGKZsIBvBsNAjCQFB/M.fEhntgCHM7eH4yxxBGzqXiH809mDzdm','Thibaut','GALLUT','Exploitant STEP',0,0,0,0,'','thibaut.gallut@agglo-niort.fr20230612053832','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-05 08:13:18',NULL,'Tg79agglo'),
(222,2002,NULL,NULL,'christophe.delclaux@','[\"ROLE_MANAGER\"]','$2y$13$wA2j0NdqzKO2prr2y9OAWO6o/kvsPLZIkbzDW8uRNoJgBmoTY64em','Christophe','Delclaux','Exploitant',0,0,0,0,'','christophe.delclaux@saur.com20200130104206','','','mouhot@biotrade.fr',0,5,'1;1;0;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-02 16:13:37','2021-11-14','Cdsaur2022!'),
(223,2002,NULL,NULL,'marjorie.arnal@saur.','[\"ROLE_MANAGER\"]','$2y$13$brnrwURgK5WvjvD87guUF.VeIAURunBN6szQ27s46QK5I8mlRGo.W','Marjorie','Arnal','Exploitant',0,0,0,0,'','marjorie.arnal@saur.com20200130104206','','','mouhot@biotrade.fr',0,5,'1;1;0;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-05 10:16:22','2022-03-03','Masaur2022!'),
(224,2002,NULL,NULL,'romain.didier@saur.c','[\"ROLE_MANAGER\"]','$2y$13$NGYj4W7mpxxL8pARjLUrSu7MBoCG8Sq4F4RQ3E0WaSAQOR8.S1//2','Romain','Didier','Responsable',0,0,0,0,'','romain.didier@saur.com20200130104206','','','mouhot@biotrade.fr',0,5,'1;1;0;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-30 15:22:47','2021-11-14','Rdsaur2022!'),
(225,2002,NULL,NULL,'mzindel@cimee.fr','[\"ROLE_MANAGER\"]','$2y$13$nXjyTXINPrAthv/0AOHeheE7qcl3MwgKpwgGt6R9s4w65CcD0T.6m','M','Zindel','Exploitant',0,0,0,0,'','mzindel@cimee.fr20200130104206','','','mouhot@biotrade.fr',0,5,'1;1;0;1;1',0,NULL,'0000-00-00 00:00:00','2022-02-14 11:58:54','2021-11-14','Mzsaur2022!'),
(226,2002,NULL,NULL,'tdhaenens@cimee.fr','[\"ROLE_MANAGER\"]','$2y$13$el25e8sp/X5hd/ChO2HOr.aqTzF6WRDsvMyv30H6DeqI7t9PzOhWu','T','Dhaenens','Exploitant',0,0,0,0,'','tdhaenens@cimee.fr20200130104206','','','mouhot@biotrade.fr',0,5,'1;1;0;1;1',0,NULL,'0000-00-00 00:00:00','2023-08-28 15:47:08','2021-11-14','Tdsaur2022!'),
(227,2002,NULL,NULL,'vbuliansk@cimee.fr','[\"ROLE_MANAGER\"]','$2y$13$KcGdOddm4tavCjyTYsjs2.dnWL.QPv8FCeK.UkBH9J.tf3kQiwJVG','V','Buliansk','Exploitant',0,0,0,0,'','vbuliansk@cimee.fr20200130104206','','','mouhot@biotrade.fr',0,5,'1;1;0;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-17 11:49:33','2021-11-14','Vbsaur2022!'),
(228,21,NULL,NULL,'syded','[\"ROLE_ADMIN\"]','$2y$13$oZOV7lzJrozEjH8VftC.p.9RR9OOK7yIFdc89YLClU8LQMYo4/oeq','syded','syded','Resp.',0,0,0,0,'','syded20210967043506','','','mouhot@biotrade.fr',0,7,'0;1;0;1',0,NULL,'0000-00-00 00:00:00','2023-09-21 15:48:13','2022-02-28','syded'),
(229,2003,NULL,NULL,'proda','[\"ROLE_MANAGER\"]','$2y$13$Mo99Ccw4rMp8rzqLnyjxB.rj8zlPl5jZn7gvyVls2PHZjSnINkNSW','Pascale','Roda','Responsable',0,0,0,0,'','proda@biotrade.fr20200130104206','','','mouhot@biotrade.fr',0,5,'1;1;0;1;1',0,NULL,'0000-00-00 00:00:00','2022-02-07 14:26:57','2021-11-14','Pr11spanc!'),
(233,2004,NULL,NULL,'mboisneau','[\"ROLE_MANAGER\"]','$2y$13$cu9AroPboQxnQoujeia41OhudEADfEl9e6qwjifutf90AGBc/XpJC','Maëva','Boisneau','Responsable',0,0,0,0,'','mboisneau@biotrade.fr20200130104206','','','mouhot@biotrade.fr',0,5,'1;1;0;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-30 10:21:26','2021-11-14','Mb11spanc!'),
(234,1000,NULL,NULL,'m.hedot','[\"ROLE_MANAGER\"]','$2y$13$s4cSEEimcfmanO/lAGqVseGrqU5ljSbASwxi3SPjConm4eSJ/4Eby','Mathieu','HEDOT','ePerf',0,0,0,0,'','mhedot20190927013608','06 52 33 76 98','','mouhot@biotrade.fr',0,5,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2022-02-28 12:06:53','2022-02-18','hedot!'),
(236,2002,NULL,NULL,'florence.soula@saur.','[\"ROLE_MANAGER\"]','$2y$13$6/PwsmpE7PhDY8hylbTktekgJrb5kckKB4AcQrdAK0aalPMUSlAYO','Florence','Soula','Exploitant',0,0,0,0,'','florence.soula@saur.com20200130104206','','','mouhot@biotrade.fr',0,5,'1;1;0;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-05 10:33:39','0000-00-00','Fssaur2022!'),
(237,14,NULL,NULL,'anisse.hamech','[\"ROLE_USER\"]','$2y$13$WxeQ3AZYT7FYTPw55oSyfO5zjjUwFh1QUTbztoEqetMr9Cf4m.8I.','Anisse','HAMECH','Electromécanicien',0,0,0,0,'','anisse.hamech@sivom-sag.fr20220408092953','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2023-07-19 11:21:21',NULL,'H7bks3Vw'),
(238,1000,NULL,NULL,'agent1','[\"ROLE_USER\"]','$2y$13$lU3V7W5j3tqMaA4zgC0UD.bAEKSeqnWn/xkA0F1vQlV7W9TumFt/S','René','Agent','Responsable',0,0,0,0,'','20240719022229','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2023-12-08 11:02:42',NULL,'agent1'),
(239,8,NULL,NULL,'mathieu.berteau@carc','[\"ROLE_MANAGER\"]','$2y$13$5vgDZF/3lHrmFsYtgBmWfOBvx7cBeej.EN/gFnP.8ZsOGLVRsdJAi','Mathieu','BERTEAU','Agent d\'exploitation',0,0,0,0,'','mathieu.berteau@carcassonne-agglo.fr20220915055611','0671659208','','mouhot@biotrade.fr',0,14,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-05 08:57:06',NULL,'Bm11eperf'),
(240,2005,NULL,NULL,'marinarnaud@eauxdujo','[\"ROLE_MANAGER\"]','$2y$13$Qtd4dXHlVq1tejHYkLz2zeU/5qg/Y3HtIWJYLG8xEKFFJxZtKK88.','Hugo','SCIBERRAS','',0,0,0,0,'','20230509025306','','','mouhot@biotrade.fr',0,5,'1;1;0;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-05 09:04:03','0000-00-00','Am31spanc!'),
(241,2003,NULL,NULL,'plecointe','[\"ROLE_MANAGER\"]','$2y$13$I151Tsjn6mPb87fdTTXki.li8YGnXcODrjavB2J4MDA/HUlXy/Qt6','Patrice','LECOINTE','',0,0,0,0,'','20220613011550','','','mouhot@biotrade.fr',0,5,'1;1;0;1;1',0,NULL,'0000-00-00 00:00:00','2022-06-08 10:49:09','2021-11-14','Pl11spanc!'),
(242,2006,NULL,NULL,'amadio@sat32.fr','[\"ROLE_MANAGER\"]','$2y$13$ttGBVgOKfioJm6DdhE9hYOZ.BE9IM2A1R.w0g06XAGMR8NWRURWhq','Valérie','AMADIO','',0,0,1,0,'','20220629011551','','','mouhot@biotrade.fr',0,5,'1;1;0;1;1',0,NULL,'0000-00-00 00:00:00','2024-10-22 11:07:01','0000-00-00','Va32spanc!'),
(244,8,NULL,NULL,'stephane.gelis@carca','[\"ROLE_USER\"]','$2y$13$Kq/PapP8fk301W.79iDW0.rYIey8o9K3x1qN4FsAzwfCUTZ9BO4D6','Stéphane','GELIS','Service Facturation',0,0,0,0,'','stephane.gelis@carcassonne-agglo.fr20230809035704','06 65 71 23 44','','mouhot@biotrade.fr',0,14,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-02 10:03:13',NULL,'Sg11eperf'),
(245,14,NULL,NULL,'andhumdine.bacar','[\"ROLE_USER\"]','$2y$13$.R2RKZX4xIL2lCf8GptjmOm7d2b7sCEkskZXepxQcLvOeudGz./7K','Andhumdine','BACAR','Agent d\'Exploitation',0,0,0,0,'','20230706024836','','','mouhot@biotrade.fr',0,14,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-02 16:38:49',NULL,'zbk5q8ip'),
(246,16,NULL,NULL,'relationusagers','[\"ROLE_USER\"]','$2y$13$UgOUdLBUyusx/fnihkd8VORZWxaXZxJzhDNVNFSMfdAOPw9UAU.ry','Technique ','Relation Usagers ','DGA DSI',1,0,0,0,'','haouahisseinekaila@gmail.com20230828023932','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2023-10-13 09:29:11',NULL,'reseau@29260'),
(248,14,NULL,NULL,'graziella.delpratcot','[\"ROLE_USER\"]','$2y$13$Ha5dJ2e96E0hL8oDEUYyjey90bXkX0V5TVVJDvU9E0p8MuRnsRLXy','Graziella','DELPRAT COTRIE','Agent d\'Exploitation',0,0,0,0,'','20220907115351','','','mouhot@biotrade.fr',0,5,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-04 12:49:37',NULL,'DCr9C23X'),
(249,8,NULL,NULL,'hugo.feutray','[\"ROLE_MANAGER\"]','$2y$13$9hbIly8hhUZrWolaqCIntu4JPYkJLaxKfrAP0xtZHX4fbOG9GjR4G','Hugo','FEUTRAY','Développeur ePerf',0,0,0,0,'','hugo.feutray@carccassonne-agglo.fr20231005064126','0651080568','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-29 08:52:03',NULL,'Hf041103!'),
(250,2007,NULL,NULL,'jeve@coeurdeloire.fr','[\"ROLE_MANAGER\"]','$2y$13$edbaGMZKpWBhft55DmF0yuM3eKrTdzD47NkUebUwJvBx6ELtkcU.a','Julie','EVE','',0,0,0,0,'','20220629011551','','','mouhot@biotrade.fr',0,5,'1;1;0;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-05 09:04:10','0000-00-00','Je58spanc!'),
(251,1009,NULL,NULL,'sylvain@biotrade.fr','[\"ROLE_MANAGER\"]','$2y$13$rH2LoE1EmucIvLxeM/haruPZWffDUqoRna2vaAKnEWyndzMp369Oi','Sylvain','Lérin-Falliero','',0,0,0,0,'','20230823092730','','','mouhot@biotrade.fr',0,5,'1;1;0;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-19 13:56:40','0000-00-00','Spanc'),
(252,8,NULL,NULL,'aurelien.fontez@carc','[\"ROLE_MANAGER\"]','$2y$13$IZO4pd3xm6nvy7QcJWZ1muvmKDNbsPbKYegkmryRL43dIB1Xc82iy','Aurélien','FONTEZ','',0,0,0,0,'','Aurelien.fontez@carcassonne-agglo.fr20230203082307','0678681943','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-31 09:56:23',NULL,'Fa11eperf'),
(253,17,NULL,NULL,'invite','[\"ROLE_READONLY\"]','$2y$13$RW9oiXCPGb3zbT.SLH0k8uFKTnT4F2GX0cytuNp.soRNz76yL0vGu','invite','invite','',0,0,0,0,'','invite20230216085656','','','mouhot@biotrade.fr',0,7,'0;1;0;0;0',0,NULL,'0000-00-00 00:00:00','2023-02-16 12:20:03',NULL,'smea31120!'),
(254,17,NULL,NULL,'jerome.montori@resea','[\"ROLE_READONLY\"]','$2y$13$sq9iq3Ianyg6FotERN8VeOIM0XpSgInEj1ugLVFbeWtMdLeeYial6','Jérôme','Montori','',0,0,0,0,'','montori20230216085656','','','mouhot@biotrade.fr',0,7,'0;1;0;0;0',0,NULL,'0000-00-00 00:00:00','2023-02-16 12:20:03',NULL,'reseau31'),
(255,17,NULL,NULL,'alain.deles@reseau31','[\"ROLE_READONLY\"]','$2y$13$6mVnoIdGZv21cV1LDUKl4OX4XAf5JFlVCGAyVBVQRRgLDqQFKiGbi','Alain','Deles','',0,0,0,0,'','deles20230216085656','','','mouhot@biotrade.fr',0,7,'0;1;0;0;0',0,NULL,'0000-00-00 00:00:00','2023-02-20 11:06:35',NULL,'reseau31'),
(257,17,NULL,NULL,'oscar.velay-gonzalez','[\"ROLE_READONLY\"]','$2y$13$06u/jJoIvKMy6pp.4fi7OuMxmG7qUDAUseOrX6Pe/TOaIYZ32XI6S','Oscar','Velay-Gonzalez','',0,0,0,0,'','oscar20230216085656','','','mouhot@biotrade.fr',0,7,'0;1;0;0;0',0,NULL,'0000-00-00 00:00:00','2023-02-16 12:20:03',NULL,'reseau31'),
(258,17,NULL,NULL,'thierry.charrin@rese','[\"ROLE_READONLY\"]','$2y$13$ZKMAmKyUy7dp6yNiKciL9e8.zQFFUDGTiJvhBBbz8E64u/2vcVL6G','Thierry','Charrin','',0,0,0,0,'','charrin20230216085656','','','mouhot@biotrade.fr',0,7,'0;1;0;0;0',0,NULL,'0000-00-00 00:00:00','2023-02-16 12:20:03',NULL,'reseau31'),
(259,17,NULL,NULL,'romain.prosdocimi@re','[\"ROLE_READONLY\"]','$2y$13$F5RzI8Q9WVFI7fAmpkZje.gjlOMXalErwAc6Ru.drVofH.D3/L7KO','Romain','Prosdocimi','',0,0,0,0,'','prosdocimi20230216085656','','','mouhot@biotrade.fr',0,7,'0;1;0;0;0',0,NULL,'0000-00-00 00:00:00','2023-02-16 12:20:03',NULL,'reseau31'),
(260,17,NULL,NULL,'lionel.despax@reseau','[\"ROLE_READONLY\"]','$2y$13$3SQGIfj60DEA8bzzQKuFwO0E/ymQAR.DwEUOFqy.lppn3Y7rrQqS6','Lionel','Despax','',0,0,0,0,'','despax20230216085656','','','mouhot@biotrade.fr',0,7,'0;1;0;0;0',0,NULL,'0000-00-00 00:00:00','2023-06-07 16:05:05',NULL,'reseau31'),
(261,17,NULL,NULL,'nicolas.carpentier@r','[\"ROLE_READONLY\"]','$2y$13$tsGBNoXZyop/6.60DrM1hugKgIDvYh3RRjZeCOBSvJhDELKQyQW12','Nicolas','Carpentier','',0,0,0,0,'','carpentier20230216085656','','','mouhot@biotrade.fr',0,7,'0;1;0;0;0',0,NULL,'0000-00-00 00:00:00','2023-06-07 09:18:43',NULL,'reseau31'),
(262,17,NULL,NULL,'yannick.duffaut@rese','[\"ROLE_READONLY\"]','$2y$13$8FL03SqqFcKBDfbuJ/kP/.yA3HhpPu4F7qhYcSRaP/ReLNHUhx2Uy','Yannick','Duffaut','',0,0,0,0,'','duffaut20230216085656','','','mouhot@biotrade.fr',0,7,'0;1;0;0;0',0,NULL,'0000-00-00 00:00:00','2023-02-16 12:20:03',NULL,'reseau31'),
(263,17,NULL,NULL,'philippe.arrecgros@r','[\"ROLE_READONLY\"]','$2y$13$c9N8fbri.ymkfhgNzKmFY.YVGd2PvMEymDbeY76LN6Xhs4Nh3tgyy','Philippe','Arrecgros','',0,0,0,0,'','arrecgros20230216085656','','','mouhot@biotrade.fr',0,7,'0;1;0;0;0',0,NULL,'0000-00-00 00:00:00','2023-02-16 12:20:03',NULL,'reseau31'),
(264,17,NULL,NULL,'axel.audoubert@resea','[\"ROLE_READONLY\"]','$2y$13$gY71jnrtbldPSQLDg9OwH.XaIe6.thyMbY4mk5MsiEUzIuYeuILNS','Axel','Audoubert','',0,0,0,0,'','audoubert20230216085656','','','mouhot@biotrade.fr',0,7,'0;1;0;0;0',0,NULL,'0000-00-00 00:00:00','2023-02-16 12:20:03',NULL,'reseau31'),
(266,11,NULL,NULL,'clement.roue','[\"ROLE_USER\"]','$2y$13$juwfqb8NsZobRTB2w17ECuBQnJl0Qqp50MeES40H.HTMrdomQAXY6','Clément','Roue','Maintenance',0,0,0,0,'','rouemo2020','','','mouhot@biotrade.fr',0,5,'1;0;0;1',0,NULL,'0000-00-00 00:00:00','2023-05-30 15:15:20',NULL,'Cr81eperf'),
(267,11,NULL,NULL,'thomas.auriol','[\"ROLE_USER\"]','$2y$13$eLhjl5DUg1twHT8HOtaWCe.Sn83aBPlM1k3g9mwvbiTaoQXzAalsK','Thomas','Auriol','Maintenance',0,0,0,0,'','auriol321313','','','mouhot@biotrade.fr',0,14,'1;0;0;1',0,NULL,'0000-00-00 00:00:00','2024-02-05 09:17:02',NULL,'Ta81eperf'),
(270,8,NULL,NULL,'baptiste.drevetbertr','[\"ROLE_MANAGER\"]','$2y$13$xcIGTtyQYVdlNcOt4bXUVuxnaUwXGE6QZwV6utIIEKLAa32yo6tL2','Baptiste','DREVET-BERTRAND','',0,0,0,0,'','baptiste.drevetbertrand@carcassonne-agglo.fr202305','0786915284','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-01 16:34:19',NULL,'Bdb11eperf'),
(271,1009,NULL,NULL,'sarah@gilbert','[\"ROLE_MANAGER\"]','$2y$13$FkgdQeDjldIP3.L8OBFayusSHxxOAePUeOYMT/x2KNNsQ5mDOWXkC','Sarah','Gilbert','',0,0,0,0,'','20220629011552','','','mouhot@biotrade.fr',0,5,'1;1;0;1;1',0,NULL,'0000-00-00 00:00:00','2023-06-02 17:01:55','0000-00-00','DemoSpanc'),
(272,8,NULL,NULL,'ANTONIO ALAIN','[\"ROLE_MANAGER\"]','$2y$13$xpUU2wlGz4m42gEPVUJvzuDQvJ.5WBjsJbDZ1RU7nqDZ8jIx8ywce','Alain','ANTONIO','Agent d\'exploitation',0,0,0,0,'','20230809040113','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,'Aa11eperf'),
(273,8,NULL,NULL,'florian.joulia@carca','[\"ROLE_MANAGER\"]','$2y$13$5s3O.2Yyg4/mDiZ4kmW49O/F69.YoVmRJrwZlFhE2Opw0XjU/3xfa','Florian','JOULIA ','Agent d\'exploitation',0,0,0,0,'','florian.joulia@carcassonne-agglo.fr20231129042212','0786155275','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-04 20:14:24',NULL,'Fj11eperf'),
(274,14,NULL,NULL,'mariehelene.lauga','[\"ROLE_USER\"]','$2y$13$Hlw8421pj9giiWfeNcTXKugl0L.1A4Xw43af0r8HwwsIwPKL9lVHu','Marie-Hélène','LAUGA','Resp. Hygiène Sécurité Environ',0,0,0,0,'','mariehelene.lauga@sivom-sag.fr20230706024820','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,'IdGrVjKH'),
(275,14,NULL,NULL,'kevin.villiers','[\"ROLE_MANAGER\"]','$2y$13$fx9e94xqbqvX6H1DBn7wReITj3ISJ0fbQGw7rDgzL4Iimnt4jHWSS','Kévin','VILLIERS','Resp. d\'Exploitation',0,0,0,0,'','kevin.villiers@sivom-sag.fr20230706024803','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-26 15:09:35',NULL,'raotKrCF'),
(276,8,NULL,NULL,'frederic.munos@veoli','[\"ROLE_USER\"]','$2y$13$FjYd8uoB31lzBhlSYhB4ueL/eq3PgqJNIAEPQuxuXgPtf633cy8Ti','ASTREINTE','VEOLIA Mr MUNOS','Agent d\'exploitation',0,0,0,0,'','frederic.munos@veolia.com20230721094355','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2023-08-14 10:28:10',NULL,'Fm11eperf'),
(278,8,NULL,NULL,'myriam.frances@carca','[\"ROLE_USER\"]','$2y$13$yI1/VMpgCzhL1u8o8IbiZ.uORgh73ga4HlZlm.vpOVM/kx/ZuDqVO','Myriam','FRANCES','Service Facturation',0,0,0,0,'','myriam.frances@carcassonne-agglo.fr20230809035336','0468105587','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-01 14:27:22',NULL,'Mf11eperf'),
(279,8,NULL,NULL,'julie.surre@carcasso','[\"ROLE_USER\"]','$2y$13$vMRQlS69KCmCZJ2lyTchgurG47gFyd11xj6yvBmOY63NEKr/Lv7wG','Julie','SURRE','Service Facturation',0,0,0,0,'','julie.surre@carcassonne-agglo.fr20230809035636','0468105668','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-29 11:28:54',NULL,'Js11eperf'),
(281,8,NULL,NULL,'melanie.pierazzo@car','[\"ROLE_USER\"]','$2y$13$GCaP8UZLd3W0nbQejawiFudLpQveKNo3LII7Qqfe1y/AWlGoJK8ha','Mélanie','PIERAZZO','Service Facturation',0,0,0,0,'','melanie.pierazzo@carcassonne-agglo.fr2023080904102','0468103575','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-31 15:31:18',NULL,'Mp11eperf'),
(282,8,NULL,NULL,'sylvain.maurel@carca','[\"ROLE_USER\"]','$2y$13$t6haJhAHvN8Ld.9sDLJNne2aYYRuxVTxGPIFjcWW43e/K1mmp7.7m','Sylvain','MAUREL','Agent d\'exploitation',0,0,0,0,'','sylvain.maurel@carcassonne-agglo.fr20230809044918','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-05 10:06:02',NULL,'Sm11eperf'),
(285,2010,NULL,NULL,'sylvain_2010@biotrad','[\"ROLE_MANAGER\"]','$2y$13$.cht1e0HGZYLf1sj/dbfveWGjcqv5I0Cu1uCherA4WTA9zBT0ezs.','Sylvain','Lérin-Falliero','',0,0,0,0,'','2023082309273012345678922','','','mouhot@biotrade.fr',0,5,'1;1;0;1;1',0,NULL,'0000-00-00 00:00:00','2023-09-19 16:03:40','0000-00-00','Spanc'),
(287,8,NULL,NULL,'jeremy.serre@veolia.','[\"ROLE_MANAGER\"]','$2y$13$nC5kxL32GVGSwV8k2cXnquKinopACc/0tw8FJG9t.7keCqyl8T7Wi','SERRE Jéremy','VEOLIA Travaux ','',0,0,0,0,'','jeremy.serre@veolia.com20230919054253','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,'Js11eperf'),
(290,14,NULL,NULL,'thomas.decurieresdec','[\"ROLE_USER\"]','$2y$13$PWIkCrEUrIF7FQ88JFm0OuclH32wssPGTXYc7ipEZpREY5C1NqcnW','Thomas','DE CURIERES DE CASTE','Agent d\'Exploitation',0,0,0,0,'','20230929083234','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-02 14:57:19',NULL,'FoDXajvZ'),
(291,21,NULL,NULL,'syded46','[\"ROLE_MANAGER\"]','$2y$13$001EyFMiuoBYYZmAHfWGdutkbGXbF1VvVwjwhYKBYTVd7xaRd.4sW','lot','lot','Développeur ePerf',0,0,0,0,'','lot@lot.fr20190722091133','06 20 01 03 65','05 61 14 69 53','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2023-10-16 11:41:53','2022-01-15','syded46'),
(292,14,NULL,NULL,'laurence.adam','[\"ROLE_MANAGER\"]','$2y$13$8X3x8OjgzS8k16wk1J1H9uTDYUn7O7cfgqR.g.6w7MlVTp8PwAsVW','Laurence','ADAM','Resp. d\'Exploitation',0,0,0,0,'','laurence.adam@sivom-sag.fr20231108124514','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-22 15:49:27',NULL,'CzqrGS3r'),
(294,16,NULL,NULL,'accueil.lesneven','[\"ROLE_USER\"]','$2y$13$mNpAc6h1o0H9X1zATT2FW.1Psza17EHAF.jYMG3zq8gQkq0lw3sCG','acc','Accueil','Accueil',1,0,0,0,'','20231023072032','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-08-09 10:57:41',NULL,'accueil@ep16'),
(295,1000,NULL,NULL,'numaform','[\"ROLE_USER\"]','$2y$13$Il98ebx86pzBW3hpBNaWhupgrSK4YiSzlLeMpbQw8xqexf5mi.sHa','zec','czec','',0,0,0,0,'','20231207014916','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,'2024-07-19','0000-00-00 00:00:00','2023-12-07 14:49:33',NULL,'formametz'),
(296,1000,NULL,NULL,'un','[\"ROLE_MANAGER\"]','$2y$13$UKM9tlfDZRcFcjFJ8j9hzOtwhF27RC6P5kBBHmm67.4MjIsjR/doy','dien','UN','Responsable',0,0,0,0,'','20231207022325','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,'2024-07-19','0000-00-00 00:00:00','2023-12-28 14:44:59',NULL,'metz'),
(297,1000,NULL,NULL,'deux','[\"ROLE_MANAGER\"]','$2y$13$wSZmYybxzhF3caOPAFIt7OcfpV.S4gZB7oyJneTtiLQl9a3G2gmim','trois','deux','',0,0,0,0,'','20231207022136','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,'2024-07-19','0000-00-00 00:00:00','2023-12-07 15:23:40',NULL,'metz'),
(298,2012,NULL,NULL,'julie.soares@epernay','[\"ROLE_MANAGER\"]','$2y$13$XV1UAHnkXupXbdH3Fg6Dae5kMgwltFdPnJYETp.UwLoWUemXk63xe','Julie','Soares','',0,0,0,0,'','20231211020601','','','mouhot@biotrade.fr',0,5,'1;1;0;1;1',0,NULL,'0000-00-00 00:00:00','2024-01-30 13:55:23','0000-00-00','jSoaresSpanc012!'),
(299,2013,NULL,NULL,'gaetan.andrieu@ccbvg','[\"ROLE_MANAGER\"]','$2y$13$AwI2VNVyWD./0Eu7sRfhEO7F.UxX3Q7cqgRP5GA4qkBGgg.e7mPSS','Gaetan','Andrieu','',0,0,0,0,'','20231211020447','','','mouhot@biotrade.fr',0,5,'1;1;0;1;1',0,NULL,'0000-00-00 00:00:00','2024-02-01 10:45:39','0000-00-00','gAndrieuSpanc013!'),
(300,2012,NULL,NULL,'marianne.zaccone@epe','[\"ROLE_MANAGER\"]','$2y$13$8AW/AXyZ7axqzjIfI5iEvefkE2Kq8aRyxDqVCcKUEAR2S.SkQJwXi','Marianne','Zaccone','',0,0,0,0,'','20231211020146','','','mouhot@biotrade.fr',0,7,'1;1;0;1;1',0,NULL,'0000-00-00 00:00:00','2023-12-11 15:05:29',NULL,'mZacconeSpanc012!'),
(302,8,NULL,NULL,'sebc','[\"ROLE_USER\"]','$2y$13$/HmSQFM995sG3AiBVrqpKejK4DqTH0d3Oylg/H1nVbtRqSSBBRxye','SEBASTIEN','CLAUDEL','',0,0,0,0,'','20240202093739','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,'Eaurecaseb'),
(303,26,NULL,NULL,'sydec','[\"ROLE_MANAGER\"]','$2y$13$orsL8EDIvdjjOj2MgE5EO.q.cwpi3NCYelFF288EdwjzoMtpVKjHu','Jean','DUPONT','Agent d\'exploitation',1,1,0,0,'','20240710110000','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-11-05 12:55:11',NULL,'sydec40'),
(305,2003,NULL,NULL,'sat32','[\"ROLE_MANAGER\"]','$2y$13$ARXEzbqYaXnqT5YOjjJwHuTIoP5qW7CKf33wc7Cs20BxtNNPA/TO6','sat32','sat32','test',0,0,0,0,'','sat3220240306012134','01.02.03.04.05','','mouhot@biotrade.fr',0,7,'1;1;1;1;1',0,NULL,'2024-02-16 00:00:00','2024-11-04 11:24:50',NULL,'sat32'),
(306,3000,NULL,NULL,'demospa   ','[\"ROLE_MANAGER\"]','$2y$13$nY9tTiJKpyFPcya.ANxR.uqbvam1btOj68GQIMhxX8ePSK6uJ4UG6','Démo','DEMO','Technicien / Technicienne',0,0,1,0,'','mouhot@biotrade.fr20241024100147','01.02.03.04.05','','mouhot@biotrade.fr',1,7,'1;1;1;1;1',0,NULL,'2024-02-16 00:00:00','2024-06-05 11:49:40',NULL,'demospa'),
(307,3000,NULL,NULL,'adminspa      ','[\"ROLE_ADMIN\"]','$2y$13$PGfyIKOtYsIhYmFBSYYa1uBTFoJr06XWR2njfIHfhcF659TY.o0nm','Admin','ADMIN','Technicien / Technicienne',0,0,1,0,'','mouhot@biotrade.fr20241025020616','01.02.03.04.05','0102030405','mouhot@biotrade.fr',1,7,'1;1;1;1;1',0,NULL,'2024-03-12 12:00:00','2024-11-05 15:29:22',NULL,'adminspa'),
(308,2014,NULL,NULL,'patrick','[\"ROLE_MANAGER\"]','$2y$13$k7FeIO9goBGv2VbLhDHPbe0pP/6XiQto5Bu.8PG/0UZW9oZmuvrxy','Patrick','MORIN','Responsable',0,0,0,0,'','demo@biotrade.fr20240207052226','01.02.03.04.05','','mouhot@biotrade.fr',0,5,'1;1;1;1;1',0,NULL,'0000-00-00 00:00:00','2024-03-12 13:36:54','0000-00-00','demo@biotrade.fr'),
(345,27,NULL,NULL,'gmao_27','[\"ROLE_ADMIN\"]','$2y$13$lvLxA/ptnBmmzrUUFRicReHisUv.sPTsnWYcHzZJAjUs34Ij.lP7.','Paul','PATRON','exploitation installations',1,0,0,0,'','mouhot@biotrade.fr20240917024627','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'2024-02-22 00:00:00','2024-10-21 11:05:38',NULL,'gmao_27'),
(350,24,NULL,NULL,'gmao_24','[\"ROLE_USER\"]','$2y$13$TkgOBnT4l6./TtVr3PT9UO4REAyCAy71es23zWM.KnY9FW0avGUVG','Gmao24','GMAO','Agent d\'exploitation',1,0,0,0,'','mouhot@biotrade.fr','0750596571','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'2024-03-06 00:00:00','2024-11-05 07:16:55',NULL,'gmao_24'),
(351,27,NULL,NULL,'user_27','[\"ROLE_USER\"]','$2y$13$1wypAcJ.hEI5Uh9wjwVH5.XopWWLUk8ZPgf1abu.zobI5LwJgOxgu','Jacques','JOUBERT','exploitation réseaux',1,0,0,0,'','mouhot@biotrade.fr20240917024509','','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'2024-02-22 00:00:00','2024-11-04 16:16:00',NULL,'user_27'),
(352,26,NULL,NULL,'40sydec','[\"ROLE_USER\"]','$2y$13$rbePTVk7cAP4GO428KZY3.egOonG.Gjdsjibw.ePGwE9Son.56zFC','Téa','ROULEAU','Electromécanicien',0,1,0,0,'','tea.rouleau@biotrade.fr20240710110255','05.39.95.37.27','0102030405','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'2024-07-10 00:00:00','2024-10-16 07:47:34',NULL,'40sydec'),
(355,27,NULL,NULL,'demo@biotrade.fr','[\"ROLE_USER\"]','$2y$13$RygrJPGYjHbpsgaYC5WlgeEe6DQaEFSqoGF7WxdFvJMdCIxZQwtN6','Robert','RICHARD','',0,0,0,0,'','mouhot@biotrade.fr20240918122158','05.39.95.37.27','0102030405','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'2024-09-18 00:00:00',NULL,NULL,'M0t2P@ss'),
(356,27,NULL,NULL,'SandrineSALOMON','[\"ROLE_USER\"]','$2y$13$sVEOPzlJZmlVyKzFVpwSSOPjZawxk.DORxcL.miR.C/cmy9x0dA42','Sandrine','SALOMON','Electromécanicien',1,1,0,0,'','demo@biotrade.fr20240918122427','04.29.48.35.30','','demo@biotrade.fr',0,7,'1;1;1;1',0,NULL,'2024-09-18 00:00:00',NULL,NULL,'123456'),
(357,3000,NULL,NULL,'yrouleau','[\"ROLE_USER\"]','$2y$13$PzWt/hE8qdfRDb3z9O0Q7ejssO2FPOMCKYpDZHPhGqZSCNEFW8rse','Yannick','ROULEAU','Agent d\'exploitation',0,0,1,0,'','demo@biotrade.fr20241022114308','05.39.95.37.27','0102030405','demo@biotrade.fr',0,7,'1;1;1;1',0,'2024-10-22','2024-10-22 00:00:00',NULL,NULL,'1234azerty'),
(360,3000,NULL,NULL,'non','[\"ROLE_READONLY\"]','$2y$13$.jEbsTJ.Eg3df/Gpno8spOgs0ee0vJconncg30HmTsGj0Z7ED1saa','non','non','Responsable',0,0,1,0,'','non@ggmail.com20241025080908','','','non@ggmail.com',0,7,'1;1;1;1',0,NULL,'2024-10-25 00:00:00',NULL,NULL,'non'),
(361,3000,NULL,NULL,'zz','[\"ROLE_READONLY\"]','$2y$13$rRORroVQY/xlsZv2Iq9ZcOwWg0Pg1ZLd.htZxQrnOmZIGafpC20BG','v','sdf','Agent d\'exploitation',0,0,1,0,'','20241025081017','','','',0,7,'1;1;1;1',0,'2024-10-25','2024-10-25 00:00:00',NULL,NULL,'dd'),
(362,3000,NULL,NULL,'7777  ','[\"ROLE_MANAGER\"]','$2y$13$TRYIaRM.glTQlDaJX.SHZehLOoKGOnDXaSdvA7t6DkrWhzdj6Cgze','777','777','Technicien / Technicienne',0,0,1,0,'','20241025090245','05.39.95.37.27','0102030405','',1,7,'1;1;1;1',0,'2024-10-25','2024-10-25 00:00:00',NULL,NULL,'7777'),
(363,3000,NULL,NULL,'admin_new','[\"ROLE_READONLY\"]','$2y$13$HgEub4uZCwBUK.rmMadMxOuS/KtGSeJNWherFFUAAmoU1iZcv0noi','Jean','New ADMIN','Agent d\'exploitation',0,0,1,0,'','mouhot@biotrade.fr20241025091716','0102030405','','mouhot@biotrade.fr',1,7,'1;1;1;1',0,NULL,'2024-10-25 00:00:00','2024-10-25 09:17:30',NULL,'admin_new'),
(364,24,NULL,NULL,'gmao_24_admin','[\"ROLE_MANAGER\"]','$2y$13$34y9rl8xT0mQ1H6it5mbAOB2rexh.2R8dbk.90JmRux1mD6xHxhLi','Adrien','ALLAUX','Agent d\'exploitation',1,0,0,0,'','mouhot@biotrade.fr','0750596571','','mouhot@biotrade.fr',0,7,'1;1;1;1',0,NULL,'2024-03-06 00:00:00','2024-11-05 07:23:23',NULL,'gmao_24_admin');
/*!40000 ALTER TABLE `utilisateur` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ville`
--

DROP TABLE IF EXISTS `ville`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ville` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ville`
--

LOCK TABLES `ville` WRITE;
/*!40000 ALTER TABLE `ville` DISABLE KEYS */;
/*!40000 ALTER TABLE `ville` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-26 19:13:22

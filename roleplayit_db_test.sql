-- phpMyAdmin SQL Dump
-- version 3.3.9
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generato il: 06 nov, 2012 at 11:35 
-- Versione MySQL: 5.5.8
-- Versione PHP: 5.3.5

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `roleplayit`
--
CREATE DATABASE `roleplayit` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `roleplayit`;

-- --------------------------------------------------------

--
-- Struttura della tabella `actors`
--

CREATE TABLE IF NOT EXISTS `actors` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `stats` text NOT NULL,
  `data` text NOT NULL,
  `owner` int(10) unsigned NOT NULL,
  `x` int(11) NOT NULL DEFAULT '0',
  `y` int(11) NOT NULL DEFAULT '0',
  `map` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Dump dei dati per la tabella `actors`
--

INSERT INTO `actors` (`id`, `name`, `stats`, `data`, `owner`, `x`, `y`, `map`) VALUES
(1, 'Bobby', '', '', 2, 11, 0, 1),
(2, 'Tables', '', '', 3, 7, 13, 1);

-- --------------------------------------------------------

--
-- Struttura della tabella `events`
--

CREATE TABLE IF NOT EXISTS `events` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `timestamp` int(10) unsigned NOT NULL,
  `cmd` varchar(30) NOT NULL,
  `data` text NOT NULL,
  `persistent` tinyint(1) NOT NULL DEFAULT '0',
  `target` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=851 ;

--
-- Dump dei dati per la tabella `events`
--

INSERT INTO `events` (`id`, `timestamp`, `cmd`, `data`, `persistent`, `target`) VALUES
(849, 1352241271, 'move', '[2,8,13]', 0, NULL),
(850, 1352241274, 'move', '[2,7,13]', 0, NULL);

-- --------------------------------------------------------

--
-- Struttura della tabella `maps`
--

CREATE TABLE IF NOT EXISTS `maps` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(80) NOT NULL,
  `width` int(11) NOT NULL,
  `height` int(11) NOT NULL,
  `tilemap` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Dump dei dati per la tabella `maps`
--

INSERT INTO `maps` (`id`, `name`, `width`, `height`, `tilemap`) VALUES
(1, 'Test', 15, 15, '[[2,1,0,1,0,1,0,0,0,1,1,0,1,1,1],[1,1,1,1,1,0,1,1,0,1,1,1,0,0,1],[1,1,0,0,1,1,0,1,1,0,0,1,1,0,0],[0,0,0,1,1,1,1,0,1,0,0,0,0,0,1],[2,2,2,2,2,0,1,1,1,1,1,1,0,1,0],[2,1,1,1,1,0,1,1,0,1,0,0,1,1,0],[2,1,1,1,1,0,1,1,0,0,1,0,0,0,0],[2,1,1,1,1,3,3,3,3,0,0,0,1,1,1],[2,1,1,1,1,0,1,0,1,0,0,0,1,0,0],[2,1,1,1,1,0,1,0,1,0,1,0,0,1,0],[0,0,0,0,0,0,0,1,1,0,0,0,1,1,1],[0,0,0,0,0,0,0,1,1,1,1,1,1,1,1],[0,0,0,2,2,2,2,1,1,0,1,0,0,1,0],[0,0,0,2,3,3,3,3,3,0,0,1,0,1,1],[0,0,0,2,3,3,3,3,3,1,0,1,0,0,2]]');

-- --------------------------------------------------------

--
-- Struttura della tabella `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(32) NOT NULL,
  `password` varchar(32) NOT NULL,
  `access_level` int(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Dump dei dati per la tabella `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `access_level`) VALUES
(1, 'admin', '21232f297a57a5a743894a0e4a801fc3', 1),
(2, 'p1', 'ec6ef230f1828039ee794566b9c58adc', 0),
(3, 'p2', '1d665b9b1467944c128a5575119d1cfd', 0);

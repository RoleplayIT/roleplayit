<?php
include 'models/database.php';

$sql[] = 'SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO"';
$sql[] = "DROP DATABASE roleplayit";
$sql[] = "CREATE DATABASE `roleplayit` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci";
$sql[] = "USE `roleplayit`";
$sql[] = "DROP TABLE IF EXISTS `characters`";
$sql[] = "CREATE TABLE IF NOT EXISTS `characters` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `stats` text NOT NULL,
  `data` text NOT NULL,
  `owner` int(10) unsigned NOT NULL,
  `x` int(11) NOT NULL DEFAULT '0',
  `y` int(11) NOT NULL DEFAULT '0',
  `map` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ";
$sql[] = "DROP TABLE IF EXISTS `events`";
$sql[] = "CREATE TABLE IF NOT EXISTS `events` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `timestamp` int(10) unsigned NOT NULL,
  `cmd` varchar(30) NOT NULL,
  `data` text NOT NULL,
  `persistent` tinyint(1) NOT NULL DEFAULT '0',
  `target` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=180 ";

$sql[] = "INSERT INTO `events` (`id`, `timestamp`, `cmd`, `data`, `persistent`, `target`) VALUES
(179, 1351805080, 'say', '<p1> Hello', 0, NULL)";

$sql[] = "DROP TABLE IF EXISTS `maps`";
$sql[] = "CREATE TABLE IF NOT EXISTS `maps` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(80) NOT NULL,
  `width` int(11) NOT NULL,
  `height` int(11) NOT NULL,
  `tilemap` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ";


$sql[] = "INSERT INTO `maps` (`id`, `name`, `width`, `height`, `tilemap`) VALUES
(1, 'Test', 15, 15, '{\"tileMap\":[[1,1,0,1,0,1,0,0,0,1,1,0,1,1,1],[1,1,1,1,1,0,1,1,0,1,1,1,0,0,1],[1,1,0,0,1,1,0,1,1,0,0,1,1,0,0],[0,0,0,1,1,1,1,0,1,0,0,0,0,0,1],[0,0,0,0,0,0,1,1,1,1,1,1,0,1,0],[1,1,0,1,0,0,1,1,0,1,0,0,1,1,0],[1,0,1,1,1,1,1,1,0,0,1,0,0,0,0],[1,0,0,1,1,1,1,1,1,0,0,0,1,1,1],[1,1,0,1,1,0,1,0,1,0,0,0,1,0,0],[0,1,1,1,0,0,1,0,1,0,1,0,0,1,0],[1,0,1,0,0,0,0,1,1,0,0,0,1,1,1],[1,0,0,0,1,1,1,0,1,1,1,1,1,1,1],[0,0,1,1,1,0,0,1,1,0,1,0,0,1,0],[1,0,1,0,1,1,1,1,1,0,0,1,0,1,1],[0,1,0,1,0,0,1,1,0,1,0,1,0,0,1]]}')";

$sql[] = "DROP TABLE IF EXISTS `users`";
$sql[] = "CREATE TABLE IF NOT EXISTS `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(32) NOT NULL,
  `password` varchar(32) NOT NULL,
  `access_level` int(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ";


$sql[] = "INSERT INTO `users` (`id`, `username`, `password`, `access_level`) VALUES
(1, 'admin', '21232f297a57a5a743894a0e4a801fc3', 1),
(2, 'p1', 'ec6ef230f1828039ee794566b9c58adc', 0),
(3, 'p2', '1d665b9b1467944c128a5575119d1cfd', 0)";

$something_broke = false;
foreach ($sql as $query)
{

	if ( $db->query($query) ) 
	{
		echo "<br>Query executed.";
	}
	else 
	{
		echo "<br>ERROR: ",mysql_error();
		$something_broke = true;
	}
		
}
if ($something_broke) echo "<br><br>SOMETHING WENT WRONG";
else echo "<br><br>DATABASE RECREATED SUCCESSFULLY";
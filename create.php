<?php
include 'models/database.php';

$sql = "CREATE TABLE `roleplayit`.`users` (
`id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY ,
`username` VARCHAR( 30 ) NOT NULL ,
`password` VARCHAR( 30 ) NOT NULL ,
`access_level` INT( 1 ) UNSIGNED NOT NULL DEFAULT '0',
UNIQUE (
`username`
)
) ENGINE = InnoDB CHARACTER SET utf8 COLLATE utf8_general_ci;";

mysql_query($sql,$con); 
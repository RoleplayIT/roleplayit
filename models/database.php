<?php
require_once 'config.inc.php';

class Database
{
	private  $connection;
	
	public function connect()
	{
		$this->connection = mysql_connect(DB_HOST, DB_USER, DB_PASS);
		if (!$this->connection) {
			die('Could not connect: ' . mysql_error());
		}
		$db_table = mysql_select_db(DB_TABLE, $this->connection);
		if (!$db_table) {
			die ('Can\'t use ' . DB_TABLE . ' : ' . mysql_error());
		}
	}
	
	public function num_rows() { return mysql_num_rows($query); }
	
	public function query($query) { return mysql_query($query); }
	
	public function fetch($result) { return mysql_fetch_array($result); }
	
	public function escape($string) { return mysql_real_escape_string($string); }
	
}

$db = new Database();
$db->connect();

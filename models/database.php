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
		mysql_set_charset('utf8', $this->connection);
	}
	
	public function num_rows($query) { return mysql_num_rows($query); }
	
	public function query($query) { return mysql_query($query); }
	
	public function fetch($result) { return mysql_fetch_array($result); }
	
	public function escape($string) { return mysql_real_escape_string($string); }
	
	public function insert_id() { return mysql_insert_id($this->connection); }
	
	public function free($result) 
	{ 
		if ($result) mysql_free_result($result); 
	}
	
}

$db = new Database();
$db->connect();

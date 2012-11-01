<?php
namespace Server;

require_once('engine.php');

use Engine;

class Network {
	/**
	 * Send data, if a client is not specified it will be sent to all
	 */
	public static function Send($data, $client=false) 
	{
		//if ($client!==false) $client = checkValidClient($client);
		
		// In our case we store on the database
		// id, timestamp, client, cmd, data
		//Storage::appendEvent($data, $client);
		//$message = $_REQUEST['data'];
		//$db->query("INSERT INTO events (timestamp, cmd, data) VALUES (".time().", 'say', '<".Session::get('username')."> ".$db->escape($message)."')");
	}
	
	public static function Receive($data) 
	{
		// Someone sent a command, let's call the handler to make sense of it
		EventHandler::execute($data);
	}
	

}
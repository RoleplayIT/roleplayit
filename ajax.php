<?php
include 'models/config.inc.php';
include 'models/logging.php';
include 'models/database.php';

error_reporting(1); // 



/**
 * Fetch the latest events 
 */
function getEvents()
{
	global $db;
	session_start();
	if (!isset($_SESSION['event_key']))
	{
		//sync();
		//$_SESSION['event_key'] = getLatestKey();
		$_SESSION['event_key'] = 0;
		session_write_close();
		Logging::lwrite('getEvents(): ' . $_SERVER['REMOTE_ADDR'] . ' new session ');
	}
	else 
	{
		$client_key = $_SESSION['event_key'];
		
		// Get all the stuf after the last update
		$out = false;
		$query = $db->query("SELECT * FROM test WHERE id >= $client_key"); 
		while ($row = $db->fetch($query))
		{
			$key = $row['id'];
			$text = $row['text'];
			
			
			if (!isset($check_first))
			{
				// if the first element is not our key then we cannot trust the input, we need a full sync
				// the event list might have been cleared or the connection lost for too long
				if ($key!=$client_key)
				{
					//sync()
					Logging::lwrite('getEvents(): ' . $_SERVER['REMOTE_ADDR'] . ' key not found -> resync (todo)');
				}
				$check_first = true;
			}
			else $out[] = array($key,htmlentities($text));
		}
		session_start();
		$_SESSION['event_key'] = $key;
		session_write_close();
		
		return $out;
	}
}

/**
 * Keep the connection open until there's data to send, the client aborts or the time's up.
 */
function send_updates()
{
	$time = time();
	while(!connection_aborted() && (time() - $time) < MAX_EXEC_TIME) 
	{
		// query for new data
		$data = getEvents();

		// if we have new data return it
		if(!empty($data)) {
			echo json_encode($data);
			break;
		}
		
		// wait for POLLING_INTERVAL microseconds
		usleep(POLLING_INTERVAL);
	}
}


if (@$_REQUEST['action']=='send')
{	
	$message = $_REQUEST['msg'];
	$db->query("INSERT INTO test (text) VALUES ('".$db->escape($message)."')");
	exit;
}

send_updates();
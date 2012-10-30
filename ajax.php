<?php
include 'models/config.inc.php';
include 'models/logging.php';
include 'models/database.php';
include 'models/session.php';
include 'models/user.php';

if (!User::isLogged()) {
	header('Location: index.php');
	exit;
}

//error_reporting(1); // 


/**
 * Fetch the latest events 
 */
function getEvents()
{
	global $db;
	
	if (Session::get('event_key')===false)
	{
		//sync();
		//$_SESSION['event_key'] = getLatestKey();
		Session::set('event_key', 0); // test
		
		Logging::lwrite('getEvents(): ' . $_SERVER['REMOTE_ADDR'] . ' new session ');
	}
	else 
	{
		$client_key = $_SESSION['event_key'];
		
		// Get all the stuff after the last update
		$out = false;
		$query = $db->query("SELECT * FROM events WHERE id >= $client_key"); 
		while ($row = $db->fetch($query))
		{
			$key = $row['id'];
			$data = $row['data'];
			
			
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
			else $out[] = array($key,htmlentities($data));
		}
		if (isset($key)) Session::set('event_key', $key);
				
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


if (isset($_REQUEST['cmd']))
{	
	// process_event();
	$cmd = $_REQUEST['cmd'];
	if ( $cmd == 'say' ) {
		$message = $_REQUEST['data'];
		$db->query("INSERT INTO events (timestamp, cmd, data) VALUES (".time().", 'say', '".$db->escape($message)."')");
		exit;
	}
}

send_updates();
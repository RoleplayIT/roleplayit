<?php
include 'models/config.inc.php';
include 'models/logging.php';
include 'models/database.php';
include 'models/session.php';
include 'models/user.php';
include 'models/engine.php';


if (!User::isLogged()) {
	header('Location: index.php');
	exit;
}

//error_reporting(1); // 

function getLatestKey() 
{
	global $db;
	$query = $db->query("SELECT id FROM events ORDER BY id DESC LIMIT 1");
	if ($row = $db->fetch($query))
	{
		return $row['id'];
	}	
	return false;
}

function client_sync() // todo
{
	global $db;
	
	$query = $db->query("SELECT * FROM events"); 
	if ( $db->num_rows($query) == 0 ) return;
	
	// chatlog
	/*
	$query = $db->query("SELECT * FROM events WHERE cmd='say'");
	while ($row = $db->fetch($query))
	{
		$chatlog[] = array($row['id'],'say', htmlentities($row['data'], ENT_QUOTES, "UTF-8"));
	}
	$db->free($row);
	*/
	// map
	// objects
	// characters
	
	
	//Session::set('event_key', getLatestKey());
	
	//Logging::lwrite('client_sync(): ' . $_SERVER['REMOTE_ADDR'] . ", sending " . json_encode($chatlog) );
	//if (!isset($chatlog)) $chatlog[] = array(getLatestKey(),'noop', '');
	$chatlog[] = array(getLatestKey(),'noop', '');
	//if (!isset($chatlog)) $chatlog[] = array(10,'say', '');
	echo json_encode($chatlog);
	exit;
	// send everything to client
	// exit;
	
	
}

/**
 * Fetch the latest events 
 */
function getEvents()
{
	global $db;
	
	$client_key = isset($_GET['key'])?intval($_GET['key']):0;

	if ($client_key==0 )
	{
		return client_sync();
	}
	else 
	{
		// Get all the stuff after the last update
		$out = false;
		$query = $db->query("SELECT * FROM events WHERE id >= $client_key"); 
		if ($db->num_rows($query)==0) return;
		while ($row = $db->fetch($query))
		{
			$key = $row['id'];
			$cmd = $row['cmd'];
			$data = $row['data'];
			
			
			if (!isset($check_first))
			{
				// if the first element is not our key then we cannot trust the input, we need a full sync
				// the event list might have been cleared or the connection lost for too long
				if ($key!=$client_key)
				{
					//Logging::lwrite('getEvents(): ' . $_SERVER['REMOTE_ADDR'] . " key $client_key not found -> resync (todo)");
					client_sync();

				}
				$check_first = true;
			}
			//else $out[] = array($key,$cmd,htmlentities($data,ENT_QUOTES, "UTF-8"));
			else $out[] = array($key,$cmd,$data);
		}
		$db->free($row);
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

// TODO refactor
if (isset($_REQUEST['cmd']))
{	
	// process_event();
	/*
	$cmd = $_REQUEST['cmd'];
	if ( $cmd == 'say' ) {
		$message = $_REQUEST['data'];
		$db->query("INSERT INTO events (timestamp, cmd, data) VALUES (".time().", 'say', '".$db->escape($message)."')");
		exit;
	}
	elseif ( $cmd == 'move' ) {
		$idx = intval($_REQUEST['idx']);
		$x = intval($_REQUEST['x']);
		$y = intval($_REQUEST['y']);
		$data = json_encode(array($idx, $x, $y));
		$db->query("INSERT INTO events (timestamp, cmd, data) VALUES (".time().", 'move', '".$data."')");
	}
	*/
	Engine\EventHandler::execute();

	exit;
}
else
send_updates();
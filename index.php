<?php
/*
* A very dirty and simple mockup server for tests
*/

include 'models/resources.php';

session_start();

///////////////////////////////////////////////
// Declarations
$TileData[] = new Tile('', '', false, true);
$TileData[] = new Tile('floor.png', '', true, false);

class Map {
	public $mapName;
	public $width;
	public $height;
	public $tileMap; 
	//Object[] objects;  
	//Character[] characters;
}
///////////////////////////////////////////////
// Initialize map
$map = new Map();
$map->mapName = 'Test';
$map->width = 15;
$map->height = 15;
for ($i=0;$i<$map->width;++$i)
{
	for ($j=0;$j<$map->height;++$j)
	{
		$map->tileMap[$i][$j] = rand(0,1);
	}
}

///////////////////////////////////////////////
// Controller
if (isset($_REQUEST['cmd'])) 
{
	$cmd = $_REQUEST['cmd'];
	if (isset($_REQUEST['cmd'])) $value = $_REQUEST['cmd'];

	switch ($cmd)
	{
		case 'get_tiles': echo json_encode($TileData); break;
		case 'get_map': echo json_encode($map); break;
		case 'say': test_say($value); exit;
		case 'update': send_events($value); exit;
		default: exit;
	}
}

function test_say($text)
{
	
	
	// id will be the serial of the entity
	$data = array( 'id'=> 0, 'text'=> $text);
	append_event('say', $data);
	
}


function append_event($name, $data) 
{
	// it should be saved in the database
	// but we'll temporarily use sessions 

	
	$key = time(); // ugh
	$_SESSION['events'][] = array($key, $name, $data);  // Useless since we haven't yet anything to make use of it.
	
}

// Sends to the client only the necessary to update the state
function send_events($current_key)
{
	// does key exists ?
	// yes: send the new events after it
	// no:  perform a full synchronization
	
	// TODO
	
	// let's make up fake events in the meanwhile
	if (rand(0,5)==5) 
	{
		$random_text = array("Random event: Hi","Random event: how's the weather ?","Random event: this thing is so lame!");
		
		$data = array( 'id'=> 0, 'text'=> $random_text[rand(0,2)]);
		$event = array( 'cmd'=> 'say', $data);
		echo json_encode($event);
	}
	
}
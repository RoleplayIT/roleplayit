<?php
/*
* A very dirty and simple mockup server for tests
*/

include 'models/resources.php';

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

	switch ($cmd)
	{
		case 'get_tiles': echo json_encode($TileData); break;
		case 'get_map': echo json_encode($map); break;
		default: exit;
	}
}
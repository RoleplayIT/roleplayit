<?php // TODO
namespace Entities;

require_once 'database.php';

class Point2D
{
	public $x;
	public $y;
	
	public function __construct($x=0, $y=0)
	{
		$this->x = $x;
		$this->y = $y;
	}
}

abstract class Entity
{
	public $map;
	public $location;
	public $serial; // for serialization ?

	abstract function Delete();
}

class Map 
{
	public $id;
	public $name;
	public $width;
	public $height;
	public $tileMap = array();
	public $objectsLayer = array();
	/*public $objects = array();  
	public $actors = array();*/
	
	private function initialize() 
	{
		for ($i=0;$i<$this->width;++$i)
		{
			for ($j=0;$j<$this->height;++$j)
			{
				$this->tileMap[$i][$j] = 0;
			}
		}
	}
	
	public function __construct($width, $height, $tileMap=null)
	{
		if ($width <= 0 || $height <= 0) exit ('Map created with invalid width/height');
		$this->width = $width; 
		$this->height = $height;
		
		$this->initialize();
		
		if ( !is_null($tileMap) )
			$this->tileMap = $tileMap;
	}

	#DAO
	public function Insert()
	{
		global $db;
		$db_name = $db->escape($this->name);
		$db_width = intval($this->width);
		$db_height = intval($this->height);
		$db_tilemap = $db->escape(json_encode($this->tileMap));

		$sql = "INSERT INTO maps (name, width, height, tilemap) VALUES ('$db_name', $db_width, $db_height, '$db_tilemap')";
		//$query = $db->query($sql);
		$query = mysql_query($sql);
		if ($query)
		{
			$this->id = $db->insert_id();
			return $this->id;
		}
		return false;
	}

	public function Update()
	{
		global $db;
		if ($this->id == null) return $this->Insert(); // new item, insert into db
		$db_name = $db->escape($this->name);
		$db_width = intval($this->width);
		$db_height = intval($this->height);
		$db_tilemap = $db->escape(json_encode($this->tileMap));

		$sql = "UPDATE maps SET name = '$db_name', width = $db_width, height = $db_height, tilemap = '$db_tilemap' WHERE id = {$this->id}";
		return $db->query($sql);
	}

	public function Delete()
	{
		global $db;
		if ($this->id === false) return false;
		$sql = "DELETE FROM maps WHERE id = $this->id";
		return $db->query($sql);
	}

	public static function Get($id)
	{
		global $db;
		$id = intval($id);
		$sql = "SELECT * FROM maps WHERE id=$id";
		$query = $db->query($sql);
		if ($row = $db->fetch($query))
		{
			$map = new Map($row['width'], $row['height'], json_decode($row['tilemap']));
			$map->name = $row['name'];
			$map->id = intval($row['id']);

			return $map;
		}

		return null;
	}

}

class Object extends Entity 
{
	public $sprite;    // isometric
	public $sprite2d;  // topdown
	
	# Entity
	public function Delete() {}
}

class Actor extends Entity
{
	public $id;
	public $name;
	public $owner;
	public $stats = array();
	public $data = array();
	public $direction;
	# TODO implement the following
	/*/
	public $color;
	public $hidden;
	public $health;
	public $maxHealth;
	public $body;
	public $inventory;
	//*/
	# END ----
	
	public function __construct($body)
	{
	}

	public function Move($location) 
	{
		$this->location = $location;
	}
	
	public function Say($text) {}
	public function Whisper($text) {}
	public function Kill() {}
	public function Resurrect() {}
	
	# Entity / DAO
	public function Insert()
	{
		global $db;
		$db_name  = $db->escape($this->name);
		$db_owner = intval($this->owner);
		$db_x     = intval($this->location['x']);
		$db_y     = intval($this->location['y']);
		$db_angle = intval($this->direction);
		$db_map   = intval($this->map);

		$sql = "INSERT INTO actors (name, stats, data, owner, x, y, angle, map) 
				VALUES ('$db_name', '', '', $db_owner, $db_x, $db_y, $db_angle, $db_map)";
		//$query = $db->query($sql);
		$query = mysql_query($sql);
		if ($query)
		{
			$this->id = $db->insert_id();
			return $this->id;
		}
		return false;
	}

	public function Update()
	{
		global $db;
		if ($this->id == null) return $this->Insert(); // new item, insert into db

		// TODO stats, data
		$db_name  = $db->escape($this->name);
		$db_owner = intval($this->owner);
		$db_x     = intval($this->location['x']);
		$db_y     = intval($this->location['y']);
		$db_angle = intval($this->direction);
		$db_map   = intval($this->map);
		
		$sql = "UPDATE actors SET 
			name  = '$db_name',
			owner = $db_owner,
			x     = $db_x,
			y     = $db_y,
			angle = $db_angle,
			map   = $db_map
			WHERE id = {$this->id}";
		return $db->query($sql);
	}

	public function Delete()
	{
		global $db;
		if ($this->id === false) return false;
		$sql = "DELETE FROM actors WHERE id = $this->id";
		return $db->query($sql);
	}

	public static function Get($id)
	{
		global $db;
		$id = intval($id);
		$sql = "SELECT * FROM actors WHERE id=$id";
		$query = $db->query($sql);
		if ($row = $db->fetch($query))
		{
			$map = new Actor(0); // TODO body
			$map->name = $row['name'];
			$map->id = intval($row['id']);

			return $map;
		}

		return null;
	}
}
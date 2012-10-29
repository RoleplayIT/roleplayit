<?php // TODO
namespace Entities;

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
	public $mapName;
	public $width;
	public $height;
	public $tileMap = array(); 
	public $objects = array();  
	public $characters = array();
	
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
		$this->height = $width;
		
		$this->initialize();
		
		if ( !is_null($tileMap) )
			$this->tileMap = $tileMap;
		
	}
	
}

class Object extends Entity 
{
	public $sprite;    // isometric
	public $sprite2d;  // topdown
	
	# Entity
	public function Delete() {}
}

class Character extends Entity
{
    public $name;
    public $color;
    public $hidden;
    public $health;
    public $maxHealth;
    public $direction;
    public $owner;
    public $stats;
    public $body;

    public $inventory;
	
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
	
	# Entity
    public function Delete() {}
}
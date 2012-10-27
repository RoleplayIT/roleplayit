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
}

class Object extends Entity 
{
	public $sprite;
	public $sprite2d;
	
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
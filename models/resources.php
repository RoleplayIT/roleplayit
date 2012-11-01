<?php

class Tile 
{
	public $srcImage;
    public $srcImage2D;
    // the following two could be just a "int flags" and then we use bitwise operators+enums
    public $passable; // or "walkable"
    public $losblock;  
	
	function __construct($srcImage, $srcImage2D, $passable, $losblock) 
	{
		$this->srcImage = $srcImage;
		$this->srcImage2D = $srcImage2D;
		$this->passable = $passable;
		$this->losblock = $losblock;
	}
}





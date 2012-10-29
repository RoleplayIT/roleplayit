<?php 
namespace Engine;

require_once('server.php');
require_once('entities.php');

use Entities;

class EventHandler 
{
	public static function execute($event) 
	{
		if (!isset($event->id, $event->cmd, $event->data)) 
		{
			// Invalid event
			return false;
		}
		else
		{
			switch($event->$id)
			{
				case 'move': $this->move($event->id, $event->data);
					break;
				case 'say':
					break;
			} // switch
			
		} // else
	}
	
	
	private static function move($entity, $location) 
	{
	}
	
	private  static function say($text, $entity) 
	{
		if ($entity instanceof(Character))
		{
			
		}
	}
	
	
} // class



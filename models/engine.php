<?php 
namespace Engine;

require_once('server.php');
require_once('session.php');
require_once('entities.php');
require_once('database.php');

use Entities;
use Session;

class EventHandler 
{
	
	public static function execute()
	{
		global $db;
		
		if (!isset($_REQUEST['cmd'])) 
		{
			// Invalid event
			return false;
		}
		else
		{
			$access_level = Session::get('access_level');
			switch($_REQUEST['cmd'])
			{
				case 'move': //$this->move($event->id, $event->data);
					$idx = intval($_REQUEST['idx']);
					$x = intval($_REQUEST['x']);
					$y = intval($_REQUEST['y']);
					$angle = intval($_REQUEST['angle']);
					
					EventHandler::actor_move($idx, $x, $y, $angle);
					break;
					
				case 'say':
					if (isset($_REQUEST['idx'])) $idx = intval($_REQUEST['idx']);
					else $idx = intval(getActorByOwner(Session::get('user_id')));
					$message = $_REQUEST['data'];
					EventHandler::say($message, $idx);
					break;
					
				case 'get_map': EventHandler::get_map(); break;
				
				case 'get_tiles': EventHandler::get_tiles(); break;
			} // switch
			
		} // else
	}
	
	
	private static function actor_move($id, $x, $y, $angle)
	{
		global $db;
		//if ($entity instanceof Entity)
		// $access_level = Session::get('access_level');
		$db->query("UPDATE actors SET x=$x, y=$y, angle=$angle WHERE id=$id");
		$data = json_encode(array($id, $x, $y, $angle));
		$db->query("INSERT INTO events (timestamp, cmd, data) VALUES (".time().", 'move', '".$db->escape($data)."')");
		
	}
	
	private static function say($text, $id)
	{
		global $db;
		$data = json_encode( array($id, htmlentities($text, ENT_QUOTES, 'UTF-8')) );
		$db->query("INSERT INTO events (timestamp, cmd, data) VALUES (".time().", 'say', '".$db->escape($data)."')");
		
	}
	
	private static function get_map()
	{
		global $db;
		$actor_id = intval(getActorByOwner(Session::get('user_id')));
		// TODO if the user is a player we should use LoS to send only a chunk of what he sees
		$query = $db->query("SELECT * FROM maps"); // let's force to the first map, for now
		if ($row = $db->fetch($query))
		{
			$map_id = $row['id'];
			$map_name = $row['name'];
			$map_width = $row['width'];
			$map_height = $row['height'];
			$tilemap = (array)json_decode($row['tilemap'], true);
			echo json_encode( array($map_id, $map_name, $map_width, $map_height, $tilemap) );
		}
	}
	
	private static function get_tiles()
	{
		// TODO
	}
	
	
} // class

function getActorByOwner($owner_id)
{
	global $db;
	$query = $db->query("SELECT id FROM actors WHERE owner=$owner_id");
	if ($row = $db->fetch($query)) return $row['id'];
	return false;
}

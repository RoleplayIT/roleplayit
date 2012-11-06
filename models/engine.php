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
					
					EventHandler::actor_move($idx, $x, $y);
					break;
				case 'say':
					if (isset($_REQUEST['idx'])) $idx = intval($_REQUEST['idx']);
					else $idx = intval(getActorByOwner(Session::get('user_id')));
					$message = $_REQUEST['data'];
					EventHandler::say($message, $idx);
					break;
			} // switch
			
		} // else
	}
	
	
	private static function actor_move($id, $x, $y) 
	{
		global $db;
		//if ($entity instanceof Entity)
		// $access_level = Session::get('access_level');
		$db->query("UPDATE actors SET x=$x, y=$y WHERE id=$id");
		$data = json_encode(array($id, $x, $y));
		$db->query("INSERT INTO events (timestamp, cmd, data) VALUES (".time().", 'move', '".$db->escape($data)."')");
		
	}
	
	private static function say($text, $id) 
	{
		global $db;
		$data = json_encode( array($id, htmlentities($text, ENT_QUOTES, 'UTF-8')) );
		$db->query("INSERT INTO events (timestamp, cmd, data) VALUES (".time().", 'say', '".$db->escape($data)."')");
		
	}
	
	
} // class

function getActorByOwner($owner_id)
{
	global $db;
	$query = $db->query("SELECT id FROM actors WHERE owner=$owner_id");
	if ($row = $db->fetch($query)) return $row['id'];
	return false;
}

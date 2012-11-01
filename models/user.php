<?php // TODO
require_once 'database.php';
require_once 'session.php';

final class AccessLevel
{
	const Player = 0;
	const GameMaster = 1;
}

class User
{
	
	public static function login($user , $pwd)
	{
		global $db;
		
		$db_user = $db->escape($user);
		$db_pwd = md5($pwd);
		
		$query = $db->query("SELECT * FROM users WHERE username='$db_user' AND password='$db_pwd'");
		if ($row = $db->fetch($query))
		{	

			$id = $row['id'];
			$username = $row['username'];
			$access_level = $row['access_level'];
						
			Session::set('user_id', $id);
			Session::set('username', $username);
			Session::set('access_level', $access_level);

			return $id;
		}
		
		return false;
		
	}
	
	public static function logout()
	{
		Session::destroy();
	}
	
	public static function isLogged()
	{
		if (Session::get('user_id') == false) return false;
		
		return true;
	}
	
	public static function getAccessLevel()
	{
		return Session::get('access_level');
	}

}
<?
/**
 * Quick session wrapper to avoid session locks and keep the code clean
 */
class Session 
{
	public static function set($name, $value)
	{
		session_start();
		$_SESSION[$name] = $value;
		session_write_close();
	}
	
	public static function get($name)
	{
		session_start();
		$out = (isset($_SESSION[$name]) ? $_SESSION[$name] : false);
		session_write_close();
		return $out;
	}
	
	public static function destroy()
	{
		session_start();
		session_unset();
		session_destroy();
		session_write_close();
	}
	
	public static function exist($name)
	{
		session_start();
		$out = isset($_SESSION[$name]);
		session_write_close();
		return $out;
	}
	
}



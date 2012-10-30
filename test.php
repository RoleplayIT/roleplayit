<?php
include 'models/user.php';

if ( User::isLogged() )
{
	echo "Logged in<br>";
	echo "Logging out.";
	User::logout();
}
else 
{
	echo "Not logged in<br>";
	echo "Logging in... ", User::login('herp', 'derp');
	if ( User::isLogged() ) echo "ok";
	echo $_SESSION['user_id'];
}
	
	

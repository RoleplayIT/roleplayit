<?php
include 'models/session.php';
include 'models/database.php';
include 'models/user.php';

if (isset($_GET['act']) && $_GET['act']=='logout')
{
	User::logout();
	header('Location: index.php');
	exit;
}
elseif ( User::isLogged() )
{
	$accessLevel = Session::get('access_level');
	switch ($accessLevel) 
	{
		case AccessLevel::Player: include 'views/client-player.php'; break;
		case AccessLevel::GameMaster: include 'views/client-dm.php'; break;
		default:
	}
	exit;
}
elseif ($_SERVER['REQUEST_METHOD']=='POST')
{
	if ( User::login($_POST['user'], $_POST['password']) )
	{
		header('Location: index.php');
		exit;
	}
	else 
	{
		$msg = "Username or Password not correct";
	}
}

?>
<html>
<head>
</head>
<body>
	<h1>Project RoleplayIT</h1>
	<form id="login_form" method="POST">
		<label>Username</label>
		<input id="user" name="user" type="text" />
		<label>Password</label>
		<input id="password" name="password" type="password" />
		<input type="submit" value="login" />
	</form>
	<div id="notice"><?php if (isset($msg)) echo $msg; ?></div>
	<br />
	User/Pass: p1
</body>
</html>
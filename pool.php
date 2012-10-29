<?php
include 'models/config.inc.php';
include 'models/database.php';

//define('POLLING_INTERVAL', 500000); // 0.5 seconds
//define('MAX_EXEC_TIME', ini_get('max_execution_time')-1 );
//define('MAX_EXEC_TIME', 5);

/*
$link = mysql_connect('localhost', 'root', '');
if (!$link) {
    die('Could not connect: ' . mysql_error());
}
$db_table = mysql_select_db('test', $link);
if (!$db_table) {
	// let's create a test table
	
    //die ('Can\'t use foo : ' . mysql_error());
}
*/


// Test stuff
 function getLatest()
{
	global $db;
	$client_id=intval(@$_REQUEST['id']);
	//$query = mysql_query("SELECT * FROM test WHERE id>$client_id");
	//while ($row = mysql_fetch_array($query) )
	$query = $db->query("SELECT * FROM test WHERE id>$client_id");
	while ($row = $db->fetch($query) )
	{
		$id = $row['id'];
		$text = $row['text'];
		
		//mysql_query("DELETE FROM test WHERE id = $id");
		
		return array($id,$text);
	
	}
	
	
	/*else 
	{ $messages = array ('Message', 'Cool huh ?', 'Worst practices','Sausages','LOL','OMG');
		if (rand(0,10)==10) return $messages[rand(0,5)];
	}*/
	
}




if (@$_REQUEST['action']=='send')
{	
	$message = $_REQUEST['msg'];
	mysql_query("INSERT INTO test (text) VALUES ('".mysql_real_escape_string($message)."')");
	exit;
}

// Keep the connection open until there's data to send, the client aborts or the time's up.
$time = time();
while(!connection_aborted() && (time() - $time) < MAX_EXEC_TIME) 
{
	// query for new data
	$data = getLatest();

	// if we have new data return it
	if(!empty($data)) {
		echo json_encode($data);
		break;
	}
	
	// wait for 0.5 seconds
	usleep(POLLING_INTERVAL);

}
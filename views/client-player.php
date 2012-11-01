<?php 
Session::set('event_key', false); // Must be reset at load 
?>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js"></script>
</head>


<body>

Player client goes here<br>
<a href="index.php?act=logout">Logout</a>

<form onsubmit="AJAXsend(msg.value);return false;" accept-charset="utf-8">
<input name="msg" id="msg" type="text" />
</form>
<style>
#console { height: 300px;overflow-y:auto; background: #223; color: #888;padding: 10px; font-family: Consolas,'Lucida Console', Monaco, monospace; } 
#console .el-0 { color: #999 } 
#console .el-1 { color: #FFF } 
#console .el-2 { color: #EA6 } 
#console .el-3 { color: #D68 }  
</style>
<div id="console" style="height: 300px;overflow-y:auto"></div>


<script>
// temp code just to color differently the various arguments
function test(x, y) {
	if (x[y] == null) return '';
	return '<span class="el-'+y+'">' + x[y] + '</span> ';
}

var eventNow = 0;

var lpOnComplete = function(response) {
    if (response!=null)
	{
		eventNow =  response[response.length-1][0];
		var console = document.getElementById('console');
		for (var i=0;i<response.length;++i)
			console.innerHTML = test(response[i],0)+ test(response[i],1)+ test(response[i],2) + test(response[i],3) +  "<br>"+console.innerHTML ;
			
		
	}
    // do more processing
    lpStart();
};


var lpStart = function() {
	$.ajax({
		type: 'GET',
		async: true,
		url: 'ajax.php',
		data: { key: eventNow },
		dataType: 'json',
		success: lpOnComplete,
		error: function () {
		// Needs error handling
		// a pause, something
		
		//    error: function(x, t, m) {
        //if(t==="timeout") { check stuff etc
		
		lpStart(); 
		}
	});
    
};


function AJAXsend(txt) {
	document.getElementById('msg').value='';
	$.ajax({
		type: 'GET',
		url: 'ajax.php',
		data: { 
			cmd: 'say',
			data: txt
			}
		,
		dataType: 'json'
	});
	
}

$(document).ready(lpStart);
</script>



</body>

</html>



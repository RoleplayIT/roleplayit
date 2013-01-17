<?php 
require_once('models/engine.php');

$userID = Session::get('user_id');
$currentActor = Engine\getActorByOwner($userID);


?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="style.css" type="text/css">
<!-- jQuery -->
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js"></script>
<link rel="stylesheet" href="http://code.jquery.com/ui/1.9.1/themes/base/jquery-ui.css" />
<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/jquery-ui.min.js"></script>

<!-- jQuery scrollbar -->
<link type="text/css" rel="stylesheet" href="js/jquery.mCustomScrollbar.css">
<script src="js/jquery.mousewheel.min.js"></script>
<script src="js/jquery.mCustomScrollbar.min.js"></script>
<script>
    (function($){
        $(document).ready(function(){
            $("#chat").mCustomScrollbar();
			
			$("#stats,#inventory,#turn_order").draggable({ handle: '.header' });
			
        });
			
    })(jQuery);
</script>

<!-- Crafty JS -->
<script type="text/javascript" src="js/crafty.js"></script>
<script type="text/javascript" src="js/game.js"></script>
<script type="text/javascript" src="js/diamondiso.js"></script>

<!-- Game classes -->
<script src="js/GameEvents.js"></script>
<script src="js/Map.js"></script>
<script src="js/Shadowcast.js"></script>
<script src="js/Sender.js"></script>
<script src="js/GUI.js"></script>

<style>


.DOM { image-rendering:optimizeSpeed;          /* Legal fallback                 */
	image-rendering:-moz-crisp-edges;          /* Firefox                        */
	image-rendering:-o-crisp-edges;            /* Opera                          */
	image-rendering:-webkit-optimize-contrast; /* Chrome (and eventually Safari) */
	image-rendering:optimize-contrast;         /* CSS3 Proposed                  */
	-ms-interpolation-mode:nearest-neighbor;   /* IE8+                           */ 
}

#console { height: 300px;overflow-y:auto; background: #223; color: #888;padding: 10px; font-family: Consolas,'Lucida Console', Monaco, monospace; } 
#console .el-0 { color: #999 } 
#console .el-1 { color: #FFF } 
#console .el-2 { color: #EA6 } 
#console .el-3 { color: #D68 }  
</style>

</head>


<body>
<div class="column">
	<!--
	<a href="#" class="btn-icon play"></a>
	<a href="#" class="btn-icon view2d"></a>
	<a href="#" class="btn-icon turn-order-off"></a>
	-->	
	<a href="#" class="btn-icon viewiso"></a>
	&nbsp;&nbsp;
	<a href="#" class="btn-icon pause"></a>
	<a href="#" class="btn-icon turn-order"></a>
	&nbsp;&nbsp;
	<a href="#" class="btn-icon tiles"></a>
	<a href="#" class="btn-icon objects"></a>
	<a href="#" class="btn-icon actors"></a>

	<div id="pane_viewport" >
        <div id="cr-stage"></div>
		
		<div id="roll_request">
			<div class="header">ROLL REQUEST</div>
			<div class="content">
				<span class="roll">1d20 + 5</span>
				<span class="description">Perception</span>
				<a href="#">Roll</a>
			</div>
		</div>
	</div>

	<div id="chat_container">
		<div class="buttons" style="float:right; padding-left:5px;">
			<a href="#" class="btn-icon speak selected"></a><br />
			<a href="#" class="btn-icon whisper"></a>
		</div>
		<div id="chat">
			<!--<p><span style="color: red;"> Gregor rolls Perception 14 + 11 = <b>25</b></span></p>-->
		</div>
		<div class="input-pane">
			<form onsubmit="AJAXsend(input_chat.value);return false;" accept-charset="utf-8">
				<input type="text" name="input_chat" id="input_chat" />
			</form>
		</div>
	</div>
</div> <!-- /column -->

<a href="index.php?act=logout">Logout</a>


<!--
<form onsubmit="AJAXsend(msg.value);return false;" accept-charset="utf-8">
<input name="msg" id="msg" type="text" />
</form>
-->
<div id="console" style="height: 300px;overflow-y:auto">
</div>


<script>

Game.userID = <?=$userID?>;
Game.currentActor = <?=$currentActor?>;

function limit(min,max, value) {
	return (value < min) ? min : (value > max ? max : value);
}


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
		{
			console.innerHTML = test(response[i],0)+ test(response[i],1)+ test(response[i],2) + test(response[i],3) +  "<br>"+console.innerHTML ;
			if (response[i][1] == 'move' )
			{
				//var toMove = document.getElementByID('actor'+)
				if (response[i][2]!='')
				{
					var data = eval(response[i][2]);
				
					var idx = data[0];
					var x = data[1];
					var y = data[2];
					var angle = data[3];
					
					GameEvents.move(idx, x, y, angle);
				}
			}
			
			if (response[i][1] == 'say' )
			{
				var data = eval(response[i][2]);
				GameEvents.say(data[0], data[1]);
				
			}
		}
			
		
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
	document.getElementById('input_chat').value='';
	$.ajax({
		type: 'GET',
		url: 'ajax.php',
		data: { 
			cmd: 'say',
			data: txt
		},
		dataType: 'json'
	});
	
}

/// Moves the actor
function move(idx, x, y, angle)
{
	$.ajax({
		type: 'GET',
		url: 'ajax.php',
		data: { 
			cmd: 'move',
			idx: idx, 
			x: x,
			y: y,
			angle: angle
		},
		dataType: 'json'
	});
}

$(document).ready(lpStart);
</script>


</body>

</html>



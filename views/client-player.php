<?php 
	//////////////////////////
?>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/jquery-ui.min.js"></script>
<script src="js/dom-drag.js"></script>

<style>
body {background:#fff;}

#viewport {position:absolute;line-height:16px;}
#iso_viewport {position:absolute;left:640px;}

.actor.body-1 { margin-left:12px; margin-top: -24px;width: 24px; height: 40px; position: absolute; background: url(gfx/characters/char_mage.png);}
.actor.body-2 { margin-left:12px; margin-top: -24px;width: 24px; height: 40px; position: absolute; background: url(gfx/characters/char_warrior.png);}
/*.actor.body-1 { width: 48px; height: 24px; position: absolute; background: url(gfx/tiles/floor_wood.png);}*/
.actor .name {position: relative; top: -30px; color:#fff; text-align:center; background:rgba(0,0,0,0.3); font-family: Tahoma; font-size:10px; width:48px; z-index:1000;}
.actor .chat { color: #000; background: #fff; font-family:Arial; width: 100px; font-size:10px; padding:5px; position:absolute; top:-40px;left:-150%; display:none;z-index:1001; border-radius:5px; border: 1px solid #ddd;}
/*.actor .chat { color: #fff; font-family:Arial; width: 100px; font-size:11px; padding:5px; position:absolute; top:-60px;left:-150%; display:none;z-index:1001;  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000,-1px  1px 0 #000, 1px  1px 0 #000; text-align:center; font-weight:bold;}*/

.tpd-tile {width:16px; height:16px; float:left; }
.tpd-tile0 { background: #000; }
.tpd-tile1 { background: #666; }
.tpd-tile2 { background: #752; }
.tpd-tile3 { background: #a25; }


.iso-tile {width:48px; height:24px; position:absolute;}
.iso-tile0 { background: transparent; }
.iso-tile1 { background: url(gfx/tiles/stonebrick.png); }
.iso-tile2 { background: url(gfx/tiles/wall_bricks.png); height:65px; margin-top:-41px; }
.iso-tile3 { background: url(gfx/tiles/floor_wood.png); }
.iso-tile:hover { opacity: 0.45; }



#console { height: 300px;overflow-y:auto; background: #223; color: #888;padding: 10px; font-family: Consolas,'Lucida Console', Monaco, monospace; } 
#console .el-0 { color: #999 } 
#console .el-1 { color: #FFF } 
#console .el-2 { color: #EA6 } 
#console .el-3 { color: #D68 }  
</style>
</head>


<body>


<?php
$tile_iso_w = 48;
$tile_iso_h = 24;

$query = $db->query("SELECT * FROM maps WHERE id = 1");
if ($row = $db->fetch($query))
{
	$map_name = $row['name'];
	$map_width = $row['width'];
	$map_height = $row['height'];
	$tilemap = (array)json_decode($row['tilemap'], true);
	echo '<div id="viewport">';
	// TOPDOWN
	for($i=0;$i<$map_width;++$i)
	{
		for($j=0;$j<$map_height;++$j)
		{
			echo '<div class="tpd-tile tpd-tile', $tilemap[$i][$j], '"></div>';
		}
		echo '<br clear="all"/>';
		
	}
	echo '</div>';
	
	echo '<div id="iso_viewport">';
	// ISOMETRIC
	for($i=0;$i<$map_width;++$i)
	{
		for($j=0;$j<$map_height;++$j)
		{
			$x = ($j * $tile_iso_w / 2) - ($i * $tile_iso_w / 2);
            $y = ($i * $tile_iso_h / 2) + ($j * $tile_iso_h / 2);
			echo '<div class="iso-tile iso-tile', $tilemap[$i][$j], '" style="left:'.$x.'px; top:'.$y.'px; z-index:', ($j+$i), ';"></div>';
		}
		
	
	}
	$query2 = $db->query("SELECT * FROM actors WHERE map = 1");
	while ($row2 = $db->fetch($query2))
	{
		$actorID = $row2['id'];
		$actorName = $row2['name'];
		$actorX = $row2['x'];
		$actorY = $row2['y'];
		$x = ($actorX * $tile_iso_w / 2) - ($actorY * $tile_iso_w / 2);
        $y = ($actorX * $tile_iso_h / 2) + ($actorY * $tile_iso_h / 2);
		echo '<div id="actor'.$actorID.'" class="actor body-'.$actorID.'" style="top: '.$y.'px; left: '.$x.'px; z-index: '.($actorX+$actorY).';"><div class="name">'.$actorName.'</div><div class="chat"></div></div>';
		//echo '<div id="actor2" class="actor body-2" style="top: 132px; left: 24px; z-index: 11;"><div class="name">Tables</div></div>';
	}
	echo '</div>';
	
}
?>

<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
Player client goes here<br>
<a href="index.php?act=logout">Logout</a>

<form onsubmit="AJAXsend(msg.value);return false;" accept-charset="utf-8">
<input name="msg" id="msg" type="text" />
</form>

<div id="console" style="height: 300px;overflow-y:auto">
</div>


<script>
var lockOnGrid = true;
//var tmp = document.getElementById('actor1');
var iso_x_offset = 640;
var iso_y_offset = 0;
var map = { width: 15, height: 15 };
for (i=1;i<=2;i++) {
	var tmp = document.getElementById('actor'+i);
	tmp.idx = i;
	tmp.old_x = tmp.style["left"];
	tmp.old_y = tmp.style["top"];
	/* ---------------------------------------------------------------- */
	if (true /*useridx==1 || useridx==data.actors[i].owner*/) {
		
		Drag.init(tmp);
		//tmp.onDragStart = function() { clearTimeout(t); };
		tmp.onDragMod= function (x,y) {
			if (lockOnGrid) {
				
				var gx = Math.round((x-iso_x_offset-24)/24);
				var gy = Math.round((y-iso_y_offset-12)/12);
				/*document.getElementById('console').innerHTML = "x:" + x +  " y:" + y
					+ " gx:" + gx + " gy:" + gy + " <br>"
					+ document.getElementById('console').innerHTML ;*/
					
				// This things translates into the actual tilemap coords
				var tx = gx;
				var ty = Math.floor((gy-((gx%2==gy%2)||(-gx%2==gy%2)?0:1))/2);
				ty = ty - Math.floor(tx/2);
				tx = tx + ty;
				//alert( "#actor"+i+" .name");
				
				tx = limit(0, map.width-1, tx);
				ty = limit(0, map.height-1, ty);
				
				//$("#actor"+this.idx+" .name").text("m:" + x +  "," + y	+ " t:" + tx + "," + ty);
				
				//this.style["left"] = (24*gx)+"px";
				//this.style["top"] = Math.floor(12*( gy-((gx%2==gy%2)||(-gx%2==gy%2)?0:1)))+"px";
				this.style["left"] = ((48*tx/2) - (48*ty/2))+"px";
				this.style["top"] = ((24*tx/2) + (24*ty/2))+"px";
				this.style["zIndex"] = ty+tx;
				
				this.tx = tx;
				this.ty = ty;
				
				
				this.old_x = this.style["left"];
				this.old_y = this.style["top"];

			}		

		}
		
		tmp.onDragEnd   = function(x,y) { 
			
			//alert(this.idx+' '+this.tx +' '+ this.ty );
			move(this.idx, this.tx, this.ty );
			//updatePosition('tblActors',this.idx,x,y);
		};
	}
}

function limit(min,max, value) {
	return (value < min) ? min : (value > max ? max : value);
}

/// Moves the actor
function move(idx, x, y)
{
	$.ajax({
		type: 'GET',
		url: 'ajax.php',
		data: { 
			cmd: 'move',
			idx: idx, 
			x: x,
			y: y
			}
		,
		dataType: 'json'
	});
}

function say(id, text)
{	
	if (id < 1) return;
	var speechBubble = $( "#actor" + id + " .chat" );
	if ( speechBubble.is(":visible") ) {
		speechBubble.html( speechBubble.html() + "<br>" + text );
	}
	else 
	{
		speechBubble.html( text );
	}
	speechBubble.show("fade") 
	clearTimeout( speechBubble.data("tout") );
	speechBubble.data( "tout", 0 );
	speechBubble.data( "tout", 
		setTimeout(function() {
			$("#actor" + id + " .chat").hide("fade");
		}, 5000)
	);

}

//$( ".actor" ).draggable( {grid:[24, 12], onDrag: drag } );
/*
function drag(event, ui) {

    var offset = $(this).parent().offset();
    var GRID_SPACING = 10;
    var SELECTION_OFFSET_X = 10;
    var SELECTION_OFFSET_Y = 3;            

    if (parseInt(event.clientX / GRID_SPACING) % 2 == 0)
    {
        var row = Math.floor((event.clientY - offset.top) / GRID_SPACING) + Math.floor(event.clientX / (2 * GRID_SPACING));
        var col = -Math.floor((event.clientY - offset.top) / GRID_SPACING) + Math.floor((event.clientX + GRID_SPACING) / (2 * GRID_SPACING));
    }
    else
    {
        var row = Math.floor((event.clientY + GRID_SPACING / 2 - offset.top) / GRID_SPACING) + Math.floor(event.clientX / (2 * GRID_SPACING));
        var col = -Math.floor((event.clientY + GRID_SPACING / 2 - offset.top) / GRID_SPACING) + Math.floor((event.clientX + GRID_SPACING) / (2 * GRID_SPACING));
    }

    var new_x = row * GRID_SPACING + col * GRID_SPACING - SELECTION_OFFSET_X;
    var new_y = (row * (GRID_SPACING / 2)) - (col * (GRID_SPACING / 2));                     

    if(event.clientX == new_x + GRID_SPACING * 2)
    {
        ui.position.left = new_x;
        new_x = event.clientX;
    }

    if(event.clientY == new_y + GRID_SPACING)
    {
        ui.position.top = new_y;
        new_y = event.clientY;
    }                    

    ui.position.left = new_x;
    ui.position.top = new_y;
}
*/

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
					try {
					var toMove = document.getElementById('actor'+data[0]);
					var tx = data[1];
					var ty = data[2];
					toMove.style["left"] = ((48*tx/2) - (48*ty/2))+"px";
					toMove.style["top"] = ((24*tx/2) + (24*ty/2))+"px";
					toMove.style["zIndex"] = ty+tx;
					}
					catch (e){}
				}
			}
			
			if (response[i][1] == 'say' )
			{
				var data = eval(response[i][2]);
				say(data[0], data[1]);
				
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


<a href="javascript:say('derp');" >Say</a>
</body>

</html>



/**
 * Handle Client side events
 */
var GameEvents = {
	///////////////////////////////////////////////////////////////
	move: function(id, x, y, angle)
	{
		try {
			/*
			var toMove = document.getElementById('actor'+id);
			toMove.style["left"] = ((48*x/2) - (48*y/2))+"px";
			toMove.style["top"] = ((24*x/2) + (24*y/2))+"px";
			toMove.style["zIndex"] = y+x;
			*/
			Game.actors[id].x = x;
			Game.actors[id].y = y;
			Game.actors[id].angle = angle;
			
			var entity = Game.actors[id].ref;
			entity._direction = angle;
			
			// TODO implement direction properly
			switch (angle) {
				case 0: entity.sprite(1,0,1,2).unflip("X");
					break;
				case 2: entity.sprite(0,0,1,2).unflip("X"); 
					break;
				case 4: entity.sprite(0,0,1,2).flip("X");
					break;
				case 6: entity.sprite(1,0,1,2).flip("X");
					break;
			}
			Game.viewport.place(entity, x, y, 2);
			
			updateFoV();
			// Game.calculateFOV();
			/*/
			var map = Game.map;
			map.fov = Shadowcast.calcFoV(map, x, y, Game.sightRadius);
			
			for (var i=0; i< map.fov.length; i++) {
				//console.log( [sight[i].x, sight[i].y ]);
				var x = map.fov[i].x;
				var y = map.fov[i].y;
				if (x<0 || y<0 || x >= map.width || y >= map.height ) continue;
				
				if (map.tilemap[x][y] === 0) map[x][y].visible = true; // gray ground
				// map[x][y] = 2;
				
			}
			//*/
			
		}
		catch (e){}
	},
	
	///////////////////////////////////////////////////////////////
	say: function(id, text)
	{	
		// write on the chat
		//myConsole.write( '&lt;' + id + '&gt; ' + text );
		GUI.chat.write(id, text);
		
		if (id < 1) return;
		
		var actor = Game.actors[id];
		if (!actor) return; // can't find actor, give up
		
		//actor.ref
		// let's display a bubble speech over the actor 
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
		
	},
	
	/*
		drawtile: function(tileID, x, y) {}
		
	
	*/
	roll: function() 
	{ 
		// user: accept roll request 
		// dm: roll (x)d(y) + (z)
	}
	
	
	
}
/**
 * Handle Client side events
 */
var GameEvents = {
	///////////////////////////////////////////////////////////////
	move: function(id, x, y, angle)
	{
		try {

			Game.actors[id].x = x;
			Game.actors[id].y = y;
			Game.actors[id].angle = angle;
			
			var entity = Game.actors[id].ref;
			entity._direction = angle;
			
			// TODO implement direction properly
			switch (angle) {
				case 0: entity.sprite(0,0);
					break;
				case 2: entity.sprite(1,0); 
					break;
				case 4: entity.sprite(2,0);
					break;
				case 6: entity.sprite(3,0);
					break;
			}
			Game.viewport.place(entity, x, y, 2);
			
			if (Game.useFoV) updateFoV();
			
		}
		catch (e){}
	},
	
	///////////////////////////////////////////////////////////////
	say: function(id, name, text)
	{	
		// write on the chat
		//myConsole.write( '&lt;' + id + '&gt; ' + text );
		GUI.chat.write(id, name, text);
		
		if (id < 1) return;
		
		var actor = Game.actors[id];
		if (!actor) return; // can't find actor, give up
		
		//actor.ref
		// let's display a bubble speech over the actor 
		var actorDiv = $( "#ent" + actor.ref[0]);
		if (actorDiv.html() == '' ) actorDiv.html('<div class="chat"></div>');
		var speechBubble = $( "#ent" + actor.ref[0] + " .chat" );
		/*if ( speechBubble.is(":visible") ) {
			speechBubble.html( speechBubble.html() + "<br>" + text );
		}
		else 
		{*/
			speechBubble.html( text );
		//}
		speechBubble.show("fade") 
		clearTimeout( actor._tout );
		actor._tout = setTimeout(function() {
				$("#ent" + actor.ref[0] + " .chat").hide("fade");
			}, 5000);
		
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
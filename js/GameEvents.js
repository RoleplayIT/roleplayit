/**
 * Handle Client side events
 */
var GameEvents = {
	///////////////////////////////////////////////////////////////
	move: function(id, x, y, direction)
	{
		try {
			var toMove = document.getElementById('actor'+id);
			toMove.style["left"] = ((48*x/2) - (48*y/2))+"px";
			toMove.style["top"] = ((24*x/2) + (24*y/2))+"px";
			toMove.style["zIndex"] = y+x;
			// TODO implement direction
		}
		catch (e){}
	},
	
	///////////////////////////////////////////////////////////////
	say: function(id, text)
	{	
		// write on the chat
		myConsole.write( '&lt;' + id + '&gt; ' + text );
		
		if (id < 1) return;
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
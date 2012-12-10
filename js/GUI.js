/**
 * Send events to server
 */
var GUI = {
	_nameColors: ['#76bdaa', '#5f96bb', '#edb44e', '#ed856c', '#c7adce'],
	///////////////////////////////////////////////////////////////
	chat: 
	{
		clear: function() 
		{
			var chat = document.getElementById('chat');
		},
		write: function(id, text)
		{
			var c=$("#chat").find(".mCSB_container");
			//.after('<p>CIAO</p>');
			//alert($("#chat").html());
			
			if (id > 0) {
				var actor = Game.actors[id];
				if (!actor) console.log("Say: id "+id + " is null.");

				var name;
				if (!actor || actor.name == '') name = "Unknown#"+id;
				else name = actor.name;
				
				var color = GUI._nameColors[id % GUI._nameColors.length]; // randomized by id
				
				c.html(c.html() + '<p><span class="name" style="color: ' + color + '">' + name + '</span>' + text + '</p>');
			}
			else {
				c.html(c.html() + '<p>' + text + '</p>');
			}
			$("#chat").mCustomScrollbar("update");
			$("#chat").mCustomScrollbar("scrollTo","bottom");
		}
	}
	
	///////////////////////////////////////////////////////////////

	
}
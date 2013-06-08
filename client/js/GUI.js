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
		write: function(id, name, text)
		{
			var c=$("#chat").find(".mCSB_container");
			//.after('<p>CIAO</p>');
			//alert($("#chat").html());
			var html_text = $('<div/>').text(text).html();

			if (id > 0) {
				var actor = Game.actors[id];
				if (!actor) console.log("Say: id "+id + " is null.");

				var name;
				if (!actor || actor.name == '') name = "Unknown#"+id;
				else name = actor.name;
				
				var color = GUI._nameColors[id % GUI._nameColors.length]; // randomized by id
				
				c.html(c.html() + '<p><span class="name" style="color: ' + color + '">' + name + '</span>' + html_text + '</p>');
			}
			else {
				c.html(c.html() + '<p>' + (name ? '<span class="name">' + name + '</span> ' : '') + html_text + '</p>');
			}
			$("#chat").mCustomScrollbar("update");
			$("#chat").mCustomScrollbar("scrollTo","bottom");
		}
	},
	
	///////////////////////////////////////////////////////////////
	mapsPane:
	{
		show: function() {
			$("#mapsPane").show();
		},
		close: function() {
			$("#mapsPane").hide();	
		},
		refresh: function() {
			// query ajax
		},
		create: function() {
			// server -> map:create
			// refresh
		},
		update: function() {
			// ajax salva su server
			this.refresh();
		},
		remove: function() {}
	},

	///////////////////////////////////////////////////////////////
	actorsPane:
	{
		show: function() {},
		close: function() {},
		refresh: function() {},
		create: function() {},
		update: function() {},
		remove: function() {}
	},

	///////////////////////////////////////////////////////////////
	tilesPane:
	{
		show: function() {},
		close: function() {},
		pick: function(idx) {}
		
	},

	///////////////////////////////////////////////////////////////
	toolbar: 
	{
		toggleMapsPane: function() {},
		toggleActorsPane: function() {}
	},

	///////////////////////////////////////////////////////////////
	rollRequestDialog: 
	{
		show: function() {
			$("#roll_request").show();
		},
		close: function() {
			$("#roll_request").hide();	
		},
		set: function(rollRequest) {
			$("#roll_request .roll").text(rollRequest.dice);
			$("#roll_request .description").text(rollRequest.description);
			this.show();
		},
		roll: function() {
			io.emit('dice:roll');
			this.close();
		}
	}
}
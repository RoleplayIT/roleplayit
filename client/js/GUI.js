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
		show: function() {
			var html_out = '<div id="tilesPaneTabs">';
			var i = 0;
			var max = Tilesets.length;

			// tabs
			html_out += '<ul>';
			while(i<max) {
				var tileset = Tilesets[i];
				var name = tileset.name;

				html_out += '<li><a href="#tilesPaneTab-' + i + '">' + name + '</a></li>';
				i++;
			}
			html_out += '</ul>';
			// actual tiles
			i = 0;
			while(i<max) {
				var tileset = Tilesets[i];
				var gid = tileset.firstgid;
				var width = tileset.cols;
				var height = tileset.rows;
				var tileWidth  = Array.isArray(tileset.tileSize) ? tileset.tileSize[0] : tileset.tileSize;
				var tileHeight = Array.isArray(tileset.tileSize) ? tileset.tileSize[1] : tileset.tileSize;


				html_out += '<div id="tilesPaneTab-' + i + '">';


				for (y=0;y<height;y++) {
					for (x=0;x<width;x++) {
						html_out += '<div style="float:left; width: ' + tileWidth + 'px; height: ' + tileHeight 
							+ 'px; background: url(' + tileset.image + ') -' + (x*tileWidth) + 'px -' + (y*tileHeight)
							+ 'px;"  onclick="GUI.tilesPane.pick(' + (gid++) + ')"></div>';
					}
				}
				html_out += '</div>';
				i++;
			}
			html_out += '<div style="clear:both;"></div>';
			html_out += '</div>';
			$('#tilesPane').html( html_out );
			$('#tilesPaneTabs').tabs();
			$('#tilesPane').show();
		},
		close: function() {
			$('#tilesPane').hide();
		},
		pick: function(id) {
			Mouse.tileId = id;
		}
		
	},

	///////////////////////////////////////////////////////////////
	toolbar: 
	{
		toggleMapsPane: function() {},
		toggleActorsPane: function() {},
		modeActor: function() {
			$('#IcoModeTile,#IcoModeObject').removeClass('selected');
			$('#IcoModeActor').addClass('selected');
			Mouse.setMode('actor');
			GUI.tilesPane.close();
		},
		modeTile: function() {
			$('#IcoModeActor,#IcoModeObject').removeClass('selected');
			$('#IcoModeTile').addClass('selected');
			Mouse.setMode('tile');
			GUI.tilesPane.show();
		}
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
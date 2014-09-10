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
				//if (!actor) console.log("Say: id "+id + " is null.");

				var name;
				//if (!actor || actor.name == '') name = "Unknown#"+id;
				//else name = actor.name;
				name = ( actor ? actor.name : name ) || name || "Unknown#"+id;
				
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
			var tileset = _.findWhere(Tilesets, {id: Game.map.tileset});

			var html_out = '<div id="tilesPaneTabs">';
			var i = 0;
			var max = tileset.groups.length;

			// tabs
			html_out += '<ul>';
			while(i<max) {
				var tileGroup = tileset.groups[i];
				var name = tileGroup.name;

				html_out += '<li><a href="#tilesPaneTab-' + i + '">' + name + '</a></li>';
				i++;
			}
			html_out += '</ul>';
			// actual tiles
			i = 0;
			while(i<max) {
				var tileGroup = tileset.groups[i];
				var gid = tileGroup.firstgid;
				var width = tileGroup[Game.viewMode].cols;
				var height = tileGroup[Game.viewMode].rows;
				var tileWidth  = Array.isArray(tileGroup[Game.viewMode].tileSize) ? tileGroup[Game.viewMode].tileSize[0] : tileGroup[Game.viewMode].tileSize;
				var tileHeight = Array.isArray(tileGroup[Game.viewMode].tileSize) ? tileGroup[Game.viewMode].tileSize[1] : tileGroup[Game.viewMode].tileSize;
				var image = tileGroup[Game.viewMode].image;
				html_out += '<div id="tilesPaneTab-' + i + '">';


				for (y=0;y<height;y++) {
					for (x=0;x<width;x++) {
						html_out += '<div style="float:left; width: ' + tileWidth + 'px; height: ' + tileHeight 
							+ 'px; background: url(' + image + ') -' + (x*tileWidth) + 'px -' + (y*tileHeight)
							+ 'px;"  onclick="GUI.tilesPane.pick(' + (gid++) + ')"></div>';
					}
				}
				html_out += '</div>';
				i++;
			}
			html_out += '<div style="clear:both;"></div>';
			html_out += '</div>';
			$('#tilesPane .content').html( html_out );
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
			$('#IcoModeTile,#IcoModeScenery').removeClass('selected');
			$('#IcoModeActor').addClass('selected');
			Mouse.setMode('actor');
			GUI.tilesPane.close();
		},
		modeTile: function() {
			$('#IcoModeActor,#IcoModeScenery').removeClass('selected');
			$('#IcoModeTile').addClass('selected');
			Mouse.setMode('tile');
			Mouse.layer = 0;
			GUI.tilesPane.show();
		},
		modeScenery: function() {
			$('#IcoModeActor,#IcoModeTile').removeClass('selected');
			$('#IcoModeScenery').addClass('selected');
			Mouse.setMode('tile');
			Mouse.layer = 1;
			GUI.tilesPane.show();
		},
		toggleViewMode: function() {
			var tileset = _.findWhere(Tilesets, {id: Game.map.tileset});

			if ( Game.viewMode == 'orthogonal' && tileset.isometric ) {
				Game.setViewMode('isometric');
			} else if ( Game.viewMode == 'isometric' && tileset.orthogonal ) {
				Game.setViewMode('orthogonal');
			}

			GUI.tilesPane.close();
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
	},
	playerList:
	{
		show: function() {
			$("#player_list").show();
		},
		close: function() {
			$("#player_list").hide();	
		},
		update: function(data) {
			var container = $("#player_list .content");
			var content  = "<ul>";
			_.each(data, function(entry,key) {
				content += '<li data-user="' + key + '"><span class="istyping"></span><span class="isturn"></span>' + entry.name + '</li>';
			});
			content += '<ul>';
			container.html(content);
		}

	}
}
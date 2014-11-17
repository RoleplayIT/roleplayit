
var Viewport = {
	supportedViewModes: ['orthogonal','isometric'],

	init: function() { // TODO rewrite
			
		// Importing assets ///////////////////////////////////////////////////////
		Crafty.sprite(48,'gfx/iso_cursor.png', {
			game_cursor: [0,0]
		});
	/*
		Crafty.sprite(24,'gfx/2d-cursor.png', {
			game_cursor: [0,0]
		});
		
	*/	
		// Initialize viewport ////////////////////////////////////////////////////
		Crafty.init();
		Crafty.background("#111");
		Crafty.viewport.init(640,400);
		Crafty.viewport.scale(1);
		//Crafty.canvas.init(); 
		Game.viewport = Crafty.diamondIso.init(48,24,15,15);
		//Game.viewport = Crafty.orthogonal.init(24,24);
		
	},
	
	setMode: function(mode) {
		if ( _.contains(this.supportedViewModes, mode) ) {
			Game.viewMode = mode;
		} else {
			console.log('ViewMode "'+mode+'" not supported');
			return;
		}

		// check if the tileset supports the specified viewmode
		var tileset = _.findWhere(Tilesets, {id: Game.map.tileset});
		if  (tileset[mode]) {
			loadTileset(tileset, mode);
			// reset viewport
			//Game.viewport = ...
			var gw = (Array.isArray(tileset[mode]) ? tileset[mode].baseSize[0] : tileset[mode].baseSize );
			var gh = (Array.isArray(tileset[mode]) ? tileset[mode].baseSize[1] : (mode=='isometric' ? tileset[mode].baseSize/2 : tileset[mode].baseSize) );
			if (mode == 'isometric') Game.viewport = Crafty.diamondIso.init(gw,gh,15,15);
			if (mode == 'orthogonal') Game.viewport = Crafty.orthogonal.init(gw,gh);

			// cursor
			Game.cursor.destroy();
			if (mode == 'isometric') Crafty.sprite(48,'gfx/iso_cursor.png', { game_cursor: [0,0] });
			if (mode == 'orthogonal') Crafty.sprite(24,'gfx/2d-cursor.png', { game_cursor: [0,0] });
			Game.cursor = Crafty.e("2D, DOM, Mouse, game_cursor");
			if (Game.interactionMode=='actor') Game.cursor.visible = false;
	

			Game.map.wipeCraftyEntities();

			// cursor


			// reposition actors
			_.each(Game.actors, function(myActor){

				if (myActor.ref) Game.viewport.place(myActor.ref, myActor.x, myActor.y, 2);
			
			});

			// draw map
			Viewport.update();

			if (Game.currentActor>0) Game.viewport.centerAt(Game.actors[Game.currentActor].x,Game.actors[Game.currentActor].y)

			// update GUI
			$('#IcoViewMode').removeClass('viewiso view2d').addClass(mode=='isometric' ? 'viewiso' : 'view2d' );
		} else {
			console.log('The current tileset does not support "'+mode+'" ViewMode');
		}

	},
	
	updateFoV: function() {
		if (!Game.currentActor) return;

		var coords = {x: Game.actors[Game.currentActor].x, y: Game.actors[Game.currentActor].y};
		var sight = Shadowcast.calcFoV(Game.map, coords.x, coords.y, Game.sightRadius);
		
		// hide all
		for(var i = 0; i < Game.map.width; i++) {
			for(var j = 0; j < Game.map.height; j++) {
				Game.map.fov[i][j] = false;
			}
		}
		
		// show visible
		for(var i = 0; i < sight.length; i++) {

			Game.map.fov[sight[i].x][sight[i].y] = true;
			// check if there's a crafty tile already associated
			/*
			if (Game.map.tilemap[i][j].hasOwnProperty('ref')) {
				var entity = Game.map.tilemap[i][j].ref;
				if entity
			}
			*/
		}
		this.update();
	},
	
	updateActors: function(actors) {
		for(var i=0;i<actors.length;i++) {
			if (Game.actors[actors[i].id]) continue; // already exists, TODO check if they need to be updated

			// here the Actor istance is created along the crafty entity
			var myActor = new Actor(actors[i].x, actors[i].y, actors[i].angle);
			Game.actors[actors[i].id] = myActor;
			myActor.name = actors[i].name;
			var entity = Crafty.e("Actor");

			entity.addComponent(actors[i].body);
			entity._id = actors[i].id;
			entity._direction = actors[i].angle;
			entity.sprite(actors[i].angle/2, 0); // FIXME
			// actor name label
			var name_label = Crafty.e("2D, DOM, Text, TextBorder").text(actors[i].name).textColor('#FFFFFF').attr({ x: entity._w-actors[i].name.length*6, y: -15 }).unselectable();
			name_label.z = 9000;
			entity.attach(name_label);
			myActor.ref = entity;

			Game.viewport.place(entity, myActor.x, myActor.y, 2);
		}

		// player actor
		if (Game.currentActor>0) {
			var player = Game.actors[Game.currentActor];
			if (player) {
				player.ref.addComponent("Isoway");	
				io.emit('actor:getProps');
			}

		}
	},

	update: function() {
		var map = Game.map;
		if (!map) return;

		for(var layer = 0; layer < map.tilemap.length; layer++) {
			var tilemap = Game.map.tilemap[layer];

			for(var i = 0; i < map.width; i++) {
				for(var j = 0; j < map.height; j++) {
					
					var tile = tilemap[i][j];
					if (!tile) continue; // 0/null is empty, always skip it
					
					var visible = true;
					if (Game.useFoVOverride!==null ? Game.useFoVOverride : Game.useFoV) {
						
						if (map.fov[i]==undefined || map.fov[i][j]==undefined )
							visible = false;
						else
							visible = map.fov[i][j];
					}
					// did we already create that tile ?
					var tilemap_e = Game.map.tilemap_e;
					if (tilemap_e[layer][i][j] != null) {

						// tile mode layer visibility modifier
						if (Game.interactionMode=='tile') {
							if (Mouse.layer!=layer) newAlpha = 0.5;
							else newAlpha = 1.0;

							if (tilemap_e[layer][i][j].alpha != newAlpha) {
								tilemap_e[layer][i][j].alpha = newAlpha;
							}
						} 
						else if (Game.fogOfWar) {
							if (visible) {
								if (tilemap_e[layer][i][j].alpha != 1.0) tilemap_e[layer][i][j].alpha = 1.0;
							}
							else if (tilemap_e[layer][i][j].alpha != 0.3) tilemap_e[layer][i][j].alpha = 0.3;
						}
						else {
							if (tilemap_e[layer][i][j].visible != visible) tilemap_e[layer][i][j].visible = visible;
							if (tilemap_e[layer][i][j].alpha != 1.0) tilemap_e[layer][i][j].alpha = 1.0;
						}

					}
					else // no, place a new one
					{
						if (!visible) continue;

						var entity = Crafty.e("2D, DOM, tile" + tile);
						tilemap_e[layer][i][j] = entity; // store reference to crafty entity
						
						//console.log(tile.ref);
						Game.viewport.place(entity, i, j, layer);

						// tile mode layer visibility modifier
						if (Game.interactionMode=='tile') {
							if (Mouse.layer!=layer) entity.alpha = 0.5;
							else entity.alpha = 1.0;
						}
					}

				} // j
			} // i
		} // layer


		// hide/show actors
		_.each(Game.actors,function(actor) {
			if (actor == Game.actors[Game.currentActor]) return;
			var visible = map.fov[actor.x][actor.y] || false;

			if (Game.useFoVOverride===false || Game.useFoV===false) visible = true;

			actor.ref.visible = visible;
			_.each(actor.ref._children,function(elem){
				elem.visible = visible;
			});
			//console.log(actor, map.fov[actor.x][actor.y]);
		});

	}
};

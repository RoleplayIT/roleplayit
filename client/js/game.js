//PERCEVAL : I put some commentaries about your personal (life)choices in the code, they start with "PER"
//ctrl+f it for simple acess
var Game = {
	viewport: null,
	map:      null,
	actors:   [],
	objects:  [],
	userID: 0,
	currentActor: 0,
	cursor: null,
	
	sightRadius: 8,
	useFoV: true,
	useFoVOverride: null, // null, false, true
	fogOfWar: true,
	viewMode: 'isometric',	// isometric - orthogonal

	setViewMode: function(mode){
		//if (mode==this.viewMode) return;
		if (mode) this.viewMode = mode;

		// TODO
		// check if the tileset allows for it
		var tileset = _.findWhere(Tilesets, {id: this.map.tileset});
		if  (tileset[mode]) {
			loadTileset(tileset, mode);
			// reset viewport
			//Game.viewport = ...
			var gw = (Array.isArray(tileset[mode]) ? tileset[mode].baseSize[0] : tileset[mode].baseSize );
			var gh = (Array.isArray(tileset[mode]) ? tileset[mode].baseSize[1] : (mode=='isometric' ? tileset[mode].baseSize/2 : tileset[mode].baseSize) );
			if (mode == 'isometric') this.viewport = Crafty.diamondIso.init(gw,gh,15,15);
			if (mode == 'orthogonal') this.viewport = Crafty.orthogonal.init(gw,gh);

			// cursor
			this.cursor.destroy();
			if (mode == 'isometric') Crafty.sprite(48,'images/iso_cursor.png', { game_cursor: [0,0] });
			if (mode == 'orthogonal') Crafty.sprite(24,'images/2d-cursor.png', { game_cursor: [0,0] });
			this.cursor = Crafty.e("2D, DOM, Mouse, game_cursor");
			if (Mouse.mode=='actor') this.cursor.visible = false;
	

			this.map.wipeCraftyEntities();

			// cursor


			// reposition actors
			_.each(Game.actors, function(myActor){

				if (myActor.ref) Game.viewport.place(myActor.ref, myActor.x, myActor.y, 2);
			
			});


			// drawpmap
			drawMap();

			if (this.currentActor>0) Game.viewport.centerAt(Game.actors[this.currentActor].x,Game.actors[this.currentActor].y)

			// update GUI
			$('#IcoViewMode').removeClass('viewiso view2d').addClass(mode=='isometric' ? 'viewiso' : 'view2d' );
		}
	}
}

/*
	Game.init()

	Game.initViewport()
	Game.setViewMode
	
*/

var Mouse = {
	tx: 0,
	ty: 0,
	button: false,
	mode: "tile", //actor, tile, scenery
	tileId: 0,
	layer: 0,
	setMode: function(mode) {
		Crafty('Actor').each(function() { this.removeComponent('Mouse'); });
		Crafty('game_cursor').visible = false;
		//Game.cursor.destroy();

		/*
		if (Game.currentActor>0) {
			var player = Game.actors[Game.currentActor];
			if (player) player.ref.removeComponent("Isoway",true);
		}
		*/
		switch(mode) {
			case 'tile':
				this.mode = 'tile';
				Crafty('game_cursor').visible = true;
				//Game.cursor = Crafty.e("2D, DOM, game_cursor");
				Game._useFoVbak = Game.useFoV; //PER : any logic behind that one underscore?
				Game.useFoVOverride = null;
				Game.useFoV = false;
				drawMap(); //PER : why do we draw the map in the mouse call?
				break;
			case 'actor':
				this.mode = 'actor';
				Crafty('Actor').each(function() { this.addComponent('Mouse'); });
				if (Game._useFoVbak) Game.useFoV = true;
				//Game.useFoV = true;
				drawMap();
				//if (player) player.ref.addComponent("Isoway");
				break;
		}
	}
}
var Tilesets;
var TileFlags;
var TileFlag;
var Bodysets;

// Draw map ///////////////////////////////////////////////////////////////
function drawMap() { // PER : isn't that more of a "createMap"?
	var map = Game.map;
	if (!map) return;

	for(var layer = 0; layer < map.tilemap.length; layer++) {
		var tilemap = Game.map.tilemap[layer];

		for(var i = 0; i < map.width; i++) {
			for(var j = 0; j < map.height; j++) {
				
				var tile = tilemap[i][j];
				if (tile==0) continue; // 0 is empty, always skip it
				
				var visible = true;
				if (Game.useFoV) {
					try {
						
						visible = map.fov[i][j];
					} catch (e) { visible = false;}
					
				}
				// did we already create that tile ?
				if (Game.map.tilemap_e[layer][i][j] != null) {
					//console.log('updateTile');
					if (Game.fogOfWar) {
						if (visible) {
							if (Game.map.tilemap_e[layer][i][j].alpha != 1.0) Game.map.tilemap_e[layer][i][j].alpha = 1.0;
						}
						else if (Game.map.tilemap_e[layer][i][j].alpha != 0.3) Game.map.tilemap_e[layer][i][j].alpha = 0.3;
					}
					else {
						if (Game.map.tilemap_e[layer][i][j].visible != visible) Game.map.tilemap_e[layer][i][j].visible = visible;
						if (Game.map.tilemap_e[layer][i][j].alpha != 1.0) Game.map.tilemap_e[layer][i][j].alpha = 1.0;
					}
				}
				else // no, place a new one
				{
					if (!visible) continue;

					var entity = Crafty.e("2D, DOM, tile" + tile);
					Game.map.tilemap_e[layer][i][j] = entity; // store reference to crafty entity
					
					//console.log(tile.ref);
					Game.viewport.place(entity, i, j, layer);
				}
			} // j
		} // i
	} // layer


	// hide/show actors
	_.each(Game.actors,function(actor) {
		if (actor == Game.actors[Game.currentActor]) return;
		var visible = map.fov[actor.x][actor.y] || false;

		actor.ref.visible = visible;
		_.each(actor.ref._children,function(elem){
			elem.visible = visible;
		});
		//console.log(actor, map.fov[actor.x][actor.y]);
	});

}
	
// Update Field of View ///////////////////////////////////////////////////
function updateFoV() {
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
	drawMap();
}

function loadTileset(tileset, mode) {
	if (typeof tileset == 'string') tileset = _.findWhere(Tilesets, {id: map.tileset}); // PER : is that typeof check REALLY necessary?
	if (!tileset) console.error('Invalid tileset'); // PER : no return/break?

	var i = 0;
	var groups = tileset.groups;
	var max = groups.length;
	var viewMode = mode || tileset.viewMode;
	while(i<max) {
		var group = groups[i];
		var gid = group.firstgid;
		var image = group[viewMode].image;
		var width = group[viewMode].cols;
		var height = group[viewMode].rows;
		var tileSize = group[viewMode].tileSize;

		var tiles = {};
		for (y=0;y<height;y++) {
			for (x=0;x<width;x++) {
				tiles["tile"+(gid++)] = [x,y];
			}
		}
		i++;

		//console.log(tileSize, image, tiles);
		if (Array.isArray(tileSize)) Crafty.sprite(tileSize[0], tileSize[1], image, tiles);
		else Crafty.sprite(tileSize, image, tiles);
	}
}

function loadBodysets(bodysets) {
	_.each(bodysets, function(body, index){
		var spriteMap = {};
		spriteMap[index] = [0,0];

		if (Array.isArray(body.tileSize)) Crafty.sprite(body.tileSize[0], body.tileSize[1], body.image, spriteMap);
		else Crafty.sprite(body.tileSize, body.image, spriteMap);
	});
}

$(document).ready(function() {
	
	
	// Importing assets ///////////////////////////////////////////////////////
	Crafty.sprite(48,'images/iso_cursor.png', {
		game_cursor: [0,0]
	});
/*
	Crafty.sprite(24,'images/2d-cursor.png', {
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
	
	
	
	// Load map from server
	io.on('map:update', function(data) {
		if (data.id != Game.map.id) return;
		
		// find and delete stuff that has been changed
		for(layer=0;layer<Game.map.tilemap.length;layer++) {
			var new_tilemap = data.tilemap[layer];
			var old_tilemap = Game.map.tilemap[layer];
			
			for(i=0;i<old_tilemap.length;i++) {
				for(j=0;j<old_tilemap[i].length;j++) {
					var tile = old_tilemap[i][j];
					var new_tile = new_tilemap[i][j];
					if (tile != new_tile) {
						if (Game.map.tilemap_e[layer][i][j]) {
							Game.map.tilemap_e[layer][i][j].destroy();
							Game.map.tilemap_e[layer][i][j] = null;
						}
					}
				} // j
			} // i
		} // layer
		Game.map.tilemap = data.tilemap;

		if (Game.useFoV) updateFoV();
		
		drawMap();
	});

	io.on('map:load', function(data) {
		// wipe old map
		if (Game.map) {
			Game.map.destroy();
		}

		// Create map object
		var map = new Map({
			id: data.id,
			name: data.name,
			width: data.width,
			height: data.height,
			tilemap: data.tilemap,
			tileset: data.tileset,
			viewMode: data.viewMode
		});
		
		Game.map = map;
		
		Game.setViewMode(Game.map.viewMode);

		if (Game.useFoV) updateFoV();
		
		drawMap();
	});
	
	io.on('dice:request', function(data) {
		console.log(data)
		console.log(Game.userID);
		if (data.user == Game.userID) {
			GUI.rollRequestDialog.set(data);
		}
	});

	// Classes ////////////////////////////////////////////////////////////////
	function Actor(x, y, angle, ref)
	{
		this.x = x;
		this.y = y;
		this.angle = angle;
		this.ref = ref;
		this.name = '';
	}
	
	// Iso cursor ////////////////////////////////////////////////////////////
	{
	//*/
	Game.cursor = Crafty.e("2D, DOM, Mouse, game_cursor");
	

	Crafty.addEvent(this, Crafty.stage.elem, "mousemove", function(e) {
		var gc = Game.viewport.px2pos( Crafty.mousePos.x,  Crafty.mousePos.y );

		if (gc.x != Mouse.tx || gc.y != Mouse.ty) {
			Mouse.tx = gc.x;
			Mouse.ty = gc.y;
			onTileOver(gc.x, gc.y);
		}
		
		function onTileOver(x, y) {
			if (Mouse.mode!='tile') return;

			Game.viewport.place(Game.cursor, x, y, 1000);
			if (Mouse.button === 0) io.emit('map:draw', { map: Game.map.id, tileId: Mouse.tileId, layer: Mouse.layer, x: gc.x, y: gc.y });
		}

	});


	//*
	
	Crafty.addEvent(this, Crafty.stage.elem, "mousedown", function(e) {
		Mouse.button = e.button;
		
		if (Mouse.mode!='tile') return;
		if (Mouse.button === 0) io.emit('map:draw', { map: Game.map.id, tileId: Mouse.tileId, layer: Mouse.layer, x: Mouse.tx, y: Mouse.ty });
		if (Mouse.button === 2) Mouse.tileId = Game.map.tilemap[Mouse.layer][Mouse.tx][Mouse.ty] || 0;
		
	});
	
	Crafty.addEvent(this, Crafty.stage.elem, "mouseup", function(e) {
		Mouse.button = false;
	});
	//*/
	}
	
	
	// Mouse panning //////////////////////////////////////////////////////////
	
	Crafty.addEvent(this, Crafty.stage.elem, "mousedown", function(e) {
		if(e.button !== 1) return;
		e.preventDefault();
		var base = {x: e.clientX, y: e.clientY};

		function scroll(e) {
			var dx = base.x - e.clientX,
				dy = base.y - e.clientY;
				base = {x: e.clientX, y: e.clientY};
			Crafty.viewport.x -= dx;
			Crafty.viewport.y -= dy;
		};

		Crafty.addEvent(this, Crafty.stage.elem, "mousemove", scroll);
		Crafty.addEvent(this, Crafty.stage.elem, "mouseup", function() {
			Crafty.removeEvent(this, Crafty.stage.elem, "mousemove", scroll);
		});
	});
	
	//Crafty.viewport.mouselook(true);
	
	io.emit('map:get');

	// Mouse Zoom /////////////////////////////////////////////////////////////
	// Implement event chain for mousewheel
	Crafty.extend({
		mouseWheelDispatch: function(e) {
			Crafty.trigger("MouseWheel", e);
		}
	});
	
	Crafty.addEvent(this, Crafty.stage.elem, (/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel", function(e) {
	//Crafty.bind("MouseWheel", function(e) {
		//equalize event object  
		var evt=window.event || e;
		//check for detail first so Opera uses that instead of wheelDelta  
		var delta=evt.detail? evt.detail*(-120) : evt.wheelDelta; 
		// get sign of delta for scale direction
		if ( delta > 0 )
			scale = 2.0;
		else
			scale = 0.5;
		var pos = Crafty.DOM.translate(evt.clientX, evt.clientY);
		
		if (scale > 1 && Crafty.viewport._zoom > 2.0) scale = 1.0;
		if (scale < 1 && Crafty.viewport._zoom < 0.5) scale = 1.0;


		Crafty.viewport.zoom(scale, pos.x, pos.y,0);
		//disable default wheel action of scrolling page  
		if (evt.preventDefault) 
			evt.preventDefault();
		else
			return false;
	});
	// Firefox handles mousewheel event differently 
	//var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel";     
	//Crafty.addEvent(this, mousewheelevt, Crafty.mouseWheelDispatch);

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

	io.on('sync', function(data) {
		// unwrap data
		Game.userID = data.userID;
		Game.currentActor = data.currentActor;
		//console.log(data);
		Tilesets = data.tilesets;
		TileFlag  = data.tileFlag;
		TileFlags = data.tileFlags;
		loadBodysets(data.bodysets);
		Bodysets  = data.bodysets;

		loadTileset(Tilesets[0], 'isometric');  //FIXME
							
		var actors = data.actors;
		for(var i=0;i<actors.length;i++) {
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
			if (player) player.ref.addComponent("Isoway");

			io.emit('actor:getProps');
		}

		Mouse.setMode('actor');

	});

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// PER : well for most of the last part you used libraries so I can't really help you, I didn't see any blatant errors though
});


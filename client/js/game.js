 
var Game = {
	viewport: null,
	map:      null,
	actors:   {},
	objects:  [],
	userID: 0,
	currentActor: 0,
	cursor: null,
	interactionMode: 'actor',
	viewMode: 'isometric',	// isometric - orthogonal
	
	sightRadius: 8,
	useFoV: true,
	useFoVOverride: null, // null, false, true
	fogOfWar: true,
	
	setInteractionMode: function(mode) {
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
				this.interactionMode = 'tile';
				Crafty('game_cursor').visible = true;
				//Game.cursor = Crafty.e("2D, DOM, game_cursor");
				//Game._useFoVbak = Game.useFoV;
				Game.useFoVOverride = false;
				//Game.useFoV = false;
				Viewport.update();
				break;
			case 'actor':
				this.interactionMode = 'actor';
				Crafty('Actor').each(function() { this.addComponent('Mouse'); });
				//if (Game._useFoVbak) Game.useFoV = true;
				Game.useFoVOverride = null;
				//Game.useFoV = true;
				Viewport.update();
				//if (player) player.ref.addComponent("Isoway");
				break;
		}
	}
}


var Mouse = {
	tx: 0,
	ty: 0,
	button: false,
	tileId: 0,
	layer: 0
}

var Tilesets;
var TileFlags;
var TileFlag;
var Bodysets;


function loadTileset(tileset, mode) {
	if (typeof tileset == 'string') tileset = _.findWhere(Tilesets, {id: map.tileset});
	if (!tileset) console.error('Invalid tileset');

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

// Classes ////////////////////////////////////////////////////////////////
// TODO move somewhere
function Actor(x, y, angle, ref)
{
	this.x = x;
	this.y = y;
	this.angle = angle;
	this.ref = ref;
	this.name = '';
}

$(document).ready(function() {
	// start socket
	io = io.connect();

	// initialize viewport (crafty)
	Viewport.init();

	// request synchronization from server
	io.emit('sync');

	// initialize GUIs
	GUI.init();
	GUI.toolbar.modeActor()


	
	// Iso cursor ////////////////////////////////////////////////////////////
	//*/
	Game.cursor = Crafty.e("2D, DOM, Mouse, game_cursor");
	
	// TODO move - INPUT BINDINGS
	Crafty.addEvent(this, Crafty.stage.elem, "mousemove", function(e) {
		var gc = Game.viewport.px2pos( Crafty.mousePos.x,  Crafty.mousePos.y );

		if (gc.x != Mouse.tx || gc.y != Mouse.ty) {
			Mouse.tx = gc.x;
			Mouse.ty = gc.y;
			onTileOver(gc.x, gc.y);
		}
		
		function onTileOver(x, y) {
			if (Game.interactionMode!='tile') return;

			Game.viewport.place(Game.cursor, x, y, 1000);
			// TODO cache multiple draws to send in a single stroke
			if (Mouse.button === 0) io.emit('map:draw', { map: Game.map.id, tileId: Mouse.tileId, layer: Mouse.layer, x: gc.x, y: gc.y });
		}

	});


	//*
	
	Crafty.addEvent(this, Crafty.stage.elem, "mousedown", function(e) {
		Mouse.button = e.button;
		
		if (Game.interactionMode!='tile') return;
		if (Mouse.button === 0) io.emit('map:draw', { map: Game.map.id, tileId: Mouse.tileId, layer: Mouse.layer, x: Mouse.tx, y: Mouse.ty });
		if (Mouse.button === 2) Mouse.tileId = Game.map.tilemap[Mouse.layer][Mouse.tx][Mouse.ty] || 0;
		
	});
	
	Crafty.addEvent(this, Crafty.stage.elem, "mouseup", function(e) {
		Mouse.button = false;
	});
	//*/

	
	
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

});


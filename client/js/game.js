var _mouseMode='actor';

var Game = {
	viewport: null,
	map:      null,
	actors:   [],
	objects:  [],
	sightRadius: 8,
	userID: 0,
	currentActor: 0
}
var TileFlags;
var TileFlag;

// Draw map ///////////////////////////////////////////////////////////////
function drawMap(useFov) {
	var map = Game.map;
	for(var i = 0; i < map.width; i++) {
		for(var j = 0; j < map.height; j++) {
			
			var tile = Game.map.tilemap[i][j];
			if (tile==0) continue; // 0 is empty, always skip it
			
			var visible = true;
			if (true) {
				try {
					
					visible = map.fov[i][j];
				} catch (e) { visible = false;}
				
			}
			// did we already create that tile ?
			if (Game.map.tilemap_e[i][j] != null) {
				//console.log('updateTile');
				//Game.map.tilemap_e[i][j].visible = visible; // update visibility
				if (visible) {
					if (Game.map.tilemap_e[i][j].alpha != 1.0) Game.map.tilemap_e[i][j].alpha = 1.0;
				}
				else if (Game.map.tilemap_e[i][j].alpha != 0.3) Game.map.tilemap_e[i][j].alpha = 0.3;
			}
			else // no, place a new one
			{
				if (!visible) continue;
				//console.log('createTile');
				var entity = Crafty.e("2D, DOM, tile" + tile);
				Game.map.tilemap_e[i][j] = entity; // store reference to crafty entity
				
				//console.log(tile.ref);
				Game.viewport.place(entity, i, j, 0);
			}
		}
	}
}
	
// Update Field of View ///////////////////////////////////////////////////
function updateFoV() {
	// TODO use associated actor
	var coords = {x: Game.actors[Game.currentActor].x, y: Game.actors[Game.currentActor].y};
	var sight = Shadowcast.calcFoV(Game.map, coords.x, coords.y, Game.sightRadius);
	//var sight = Shadowcast.calcFoV(Game.map, 13, 8, 12);
	
	
	// hide all
	for(var i = 0; i < Game.map.width; i++) {
		for(var j = 0; j < Game.map.height; j++) {
			Game.map.fov[i][j] = false;
		}
	}
	
	// show visible
	for(var i = 0; i < sight.length; i++) {

		Game.map.fov[sight[i].x][sight[i].y] = true;
		// let's check if there's a crafty tile already associated
		/*
		if (Game.map.tilemap[i][j].hasOwnProperty('ref')) {
			var entity = Game.map.tilemap[i][j].ref;
			if entity
		}
		*/
	}
	drawMap(true);
}

$(document).ready(function() {
	
	
	// Importing assets ///////////////////////////////////////////////////////
	/*
	Crafty.sprite(48, "images/sprite.png", {
		tile0: [0,0],
		tile1: [1,0],
		tile2: [2,0],
		tile3: [3,0],
		tile4: [4,0],
		tile5: [0,1],
		tile6: [1,1],
		tile7: [2,1],
		tile8: [3,1],
		tile9: [4,1],
		tile10: [0,2,1,2],
		tile11: [1,2,1,2],
		tile12: [2,2,1,2],
		tile13: [3,2,1,2],
		tree: [4,2,1,2]
	});
	*/
	Crafty.sprite(24,'images/char_mage.png', {
		mage: [0,0,1,2]
	});
	
	Crafty.sprite(24,'images/char_mage2.png', {
		mage2: [0,0,1,2]
	});
	
	Crafty.sprite(48,'images/iso_cursor.png', {
		iso_cursor: [0,0]
	});
	
	// Tile flags
	/* comes with sync
	TileFlags = [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3];
	TileFlag = {
		Impassable: 0x01,
		BlockLOS: 0x02
	}
	*/
	
	// Initialize viewport ////////////////////////////////////////////////////
	Crafty.init();
	Crafty.background("#111");
	Crafty.viewport.init(640,420);
	Crafty.viewport.scale(1);
	//Crafty.canvas.init(); 
	iso = Crafty.diamondIso.init(48,24,15,15);
	Game.viewport = iso;
	
	
	
	// Load map from server
	io.on('map:update', function(data) {
		// Create map object
		var map = new Map(data.width, data.height);
		map.id = data.id;
		map.name = data.name;
		map.width = data.width;
		map.height = data.height;
		map.tilemap = data.tilemap;
		
		Game.map = map;
		
		updateFoV();
		
		drawMap(true);
	});
	
	io.on('dice:request', function(data) {
		console.log(data)
		console.log(Game.userID);
		if (data.user == Game.userID) {
			GUI.rollRequestDialog.set(data);
		}
	});

//  ajax_getMap();
	/*
	// Update Field of View ///////////////////////////////////////////////////
	function updateFoV() {
		// TODO use associated actor
		var coords = {x: Game.actors[1].x, y: Game.actors[1].y};
		var sight = Shadowcast.calcFoV(Game.map, coords.x, coords.y, Game.sightRadius);
		//var sight = Shadowcast.calcFoV(Game.map, 13, 7, 12);
		//console.log(sight);
		for(var i = 0; i < sight.length; i++) {
			Game.map.fov[sight[i].x][sight[i].y] = true;
			// let's check if there's a crafty tile already associated

		}
		drawMap(true);
	}
	*/
	
	// Classes ////////////////////////////////////////////////////////////////
	function Actor(x, y, angle, ref)
	{
		this.x = x;
		this.y = y;
		this.angle = angle;
		this.ref = ref;
		this.name = '';
	}
	
		
	// Keyboard movement //////////////////////////////////////////////////////
	Crafty.c("Isoway", {
		_active: 1,
		_direction: 0, // 0 - 7 
		_lastMove: 0,
		_moveMatrix: [ [0,-1], [1,-1], [1,0], [1,1], [0,1], [-1,1], [-1,0], [-1,-1] ],
		
		
		init: function() {
			//Game.actors[this._id].ref = this;
			//this.addComponent("Keyboard, Solid, Collision").origin("center");
			//this.collision(new Crafty.polygon([[2,12],[7,5],[16,2],[27,7],[30,13],[29,42],[29,56],[24,65],[7,64],[1,56],[3,39],[2,20]]));
			this.addComponent("Keyboard, Solid");
			
			this.bind("EnterFrame", function() {
				if(!this._active) return;
				// ...

			}).bind("KeyDown", function(e) {
			//});
			//Crafty.addEvent(this, Crafty.stage.elem, "keypress", function(e) {
			
				//already processed this key event
				if(this.lastMove+100 < e.timeStamp || !this._active) return;
				
				if ( !this.isDown(Crafty.keys.UP_ARROW) 
					&& !this.isDown(Crafty.keys.DOWN_ARROW) 
					&& !this.isDown(Crafty.keys.LEFT_ARROW) 
					&& !this.isDown(Crafty.keys.RIGHT_ARROW) ) return; // No useful keystroke
				

				//turning
				if(this.isDown(Crafty.keys.LEFT_ARROW)) {
					this._direction = (6 + this._direction) % 8;
				}
				
				if(this.isDown(Crafty.keys.RIGHT_ARROW)) {
					this._direction = (this._direction + 2) % 8;
				}

		
				switch (this._direction) {
					case 0: this.sprite(1,0,1,2).unflip("X");
						break;
					case 2: this.sprite(0,0,1,2).unflip("X"); 
						break;
					case 4: this.sprite(0,0,1,2).flip("X");
						break;
					case 6: this.sprite(1,0,1,2).flip("X");
						break;
				}
				
				var actor = Game.actors[this._id];
				actor.angle = this._direction;

				
				// TODO check movement
				var newPos = { x: actor.x, y: actor.y };
				// forward
				if(this.isDown(Crafty.keys.UP_ARROW)) {
					//iso.place(this, pos.x + this._moveMatrix[this._direction][0], pos.y + this._moveMatrix[this._direction][1], 2);
					newPos = {
						x: actor.x + this._moveMatrix[this._direction][0],
						y: actor.y + this._moveMatrix[this._direction][1]
					}
				
				}
				
				// backward
				if(this.isDown(Crafty.keys.DOWN_ARROW)) {
					//iso.place(this, pos.x - this._moveMatrix[this._direction][0], pos.y - this._moveMatrix[this._direction][1], 2);
					newPos = {
						x: actor.x - this._moveMatrix[this._direction][0],
						y: actor.y - this._moveMatrix[this._direction][1]
					}
				}
				
				// check if valid movement
				if ( !checkMovement(newPos.x, newPos.y) ) return; // TODO check passage flag
				else
				{
					actor.x = newPos.x;
					actor.y = newPos.y;
				}
				
				iso.place(this, actor.x , actor.y, 2);
				
				// Send the event to the server
				Sender.move(this._id, actor.x, actor.y, this._direction);
				// Center on character
				Crafty.viewport.scroll("_x", Crafty.viewport._zoom*(-this.x - this.w/2) + Crafty.viewport.width / 2 );
				Crafty.viewport.scroll("_y", Crafty.viewport._zoom*(-this.y - this.h/2) + Crafty.viewport.height / 2 );
				
			});
		}
	});
	
	function checkMovement(x,y)
	{
		if ( x > Game.map.width-1 || x < 0 ) return false; // x out of bounds
		if ( y > Game.map.height-1 || y < 0 ) return false; // y out of bounds
		
		//if ( Game.map.tilemap[x][y] === 0 ) return false; // TODO replace with check with passable flag
		//if ( TileFlags[Game.map.tilemap[x][y]] & TileFlag.Impassable ) return false;
		if ( Game.map.canWalk({x:x, y:y}) ) return false;
		//if ( Game.map.tilemap[x][y] === 0 ) return false; // TODO replace with check with passable flag
		
		return true;
	}
	
	// Iso cursor ////////////////////////////////////////////////////////////
	{
	//*/
	var iso_cursor = Crafty.e("2D, DOM, iso_cursor");
	
	Crafty.addEvent(this, Crafty.stage.elem, "mousemove", function(e) {
		if (_mouseMode!='tile') return;
		var gc = iso.px2pos(  Crafty.mousePos.x,  Crafty.mousePos.y );
		//console.log(gc);
		//iso.place(gc.x, gc.y, 0, this);
		iso.place(iso_cursor, gc.x, gc.y, 1000);
		if (_button === 0) iso.place( Crafty.e("2D, DOM, tile0"), gc.x, gc.y, 0 );
		//console.log(_button);
		//console.log(e);
	});
	var _button = false;
	//*
	Crafty.addEvent(this, Crafty.stage.elem, "mousedown", function(e) {
		_button = e.button;
		
		if (_mouseMode!='tile') return;

		var gc = iso.px2pos(  Crafty.mousePos.x,  Crafty.mousePos.y );
		if (e.button === 0) iso.place( Crafty.e("2D, DOM, tile0"), gc.x, gc.y, 0 );
	});
	
	Crafty.addEvent(this, Crafty.stage.elem, "mouseup", function(e) {
		_button = false;
	});
	//*/
	}
	
	// Trees //////////////////////////////////////////////////////////////////
	iso.place(Crafty.e("2D, DOM, tree"), 13, 5, 1);
	iso.place(Crafty.e("2D, DOM, tree"), 5, 9, 1);
	// ---
	
	// Mouse panning //////////////////////////////////////////////////////////
	Crafty.addEvent(this, Crafty.stage.elem, "mousedown", function(e) {
		if(e.button !== 2) return;
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
	
	//ajax_getMap();
	io.emit('map:get');
	
	$(".DOM").css({
		'-moz-user-select':'none',
		'-webkit-user-select':'none',
		'user-select':'none',
		'-o-user-select':'none',
		'-ms-user-select':'none'
	});
	//Crafty.e("2D, DOM, Text").attr({ x: 100, y: 100}).text("Look at me!!").attr("z",1000);
	
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
	function loadTilesets(tilesets) {
		var i = 0;
		var max = tilesets.length;
		while(i<max) {
			var tileset = tilesets[i];
			var gid = tileset.firstgid;
			var width = tileset.cols;
			var height = tileset.rows;
			
			var tiles = {};
			for (y=0;y<height;y++) {
				for (x=0;x<width;x++) {
					tiles["tile"+(gid++)] = [x,y];
				}
			}
			i++;
			Crafty.sprite(tileset.tileSize, tileset.image, tiles);
			console.log(tileset.tileSize, tileset.image, tiles);
		}
	}

	io.on('sync', function(data) {
		// unwrap data
		Game.userID = data.userID;
		Game.currentActor= data.currentActor;
		console.log(data);
		loadTilesets(data.tilesets);
		TileFlag = data.tileFlag;
		TileFlags = data.tileFlags;

		function _actor_onDragging(e) {
			if (_mouseMode!='actor') return true;
			var gc = Game.viewport.px2pos(  Crafty.mousePos.x,  Crafty.mousePos.y );
			Game.viewport.place(this, gc.x, gc.y, 2);
		}

		function _actor_onStopDrag(e) {
			var gc = Game.viewport.px2pos(  Crafty.mousePos.x,  Crafty.mousePos.y );
			var actor = Game.actors[this._id];
			if (gc.x == actor.x && gc.y == actor.y) return; // no change, abort
			// check if valid movement
			// should we ignore the check for the DM ?
			if ( !checkMovement(gc.x, gc.y) ) 
			{
				gc.x = actor.x;
				gc.y = actor.y;
			}

			Sender.move(this._id, gc.x, gc.y, this._direction);
		}

		var actors = data.actors;
		console.log(actors);
		for(var i=0;i<actors.length;i++) {
			var myActor = new Actor(actors[i].x, actors[i].y, actors[i].angle);
			Game.actors[actors[i].id] = myActor;
			myActor.name = actors[i].name;
			var entity = Crafty.e("2D, DOM, Actor, mage, Mouse, Draggable")
				.bind("Dragging", _actor_onDragging)
				.bind("StopDrag", _actor_onStopDrag);
			entity._id = actors[i].id;
			myActor.ref = entity;

			Game.viewport.place(entity, myActor.x, myActor.y, 2);
		}

			// player actor
		if (Game.currentActor>0) {
			var player = Game.actors[Game.currentActor];
			if (player) player.ref.addComponent("Isoway");
		}

	});

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
});

function mouseMode(mode)
{
	_mouseMode = mode;
}

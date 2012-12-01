var _mouseMode='actor';


$(document).ready(function() {
	Crafty.init();
	Crafty.background("#111")
	Crafty.viewport.init(780, 540);
	Crafty.viewport.scale(1);
	//Crafty.canvas.init(); 
	
	
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
	
	Crafty.sprite(24,'images/char_mage.png', {
		mage_0: [0,0,1,2],
		mage_1: [1,0,1,2]
	});
    
    Crafty.sprite(48,'images/iso_cursor.png', {
		iso_cursor: [0,0]
	});


	var myTiles = ['grass', 'stone', 'wallstone', 'wallwood'];
	var tilemap = [3,0,0 , 0,0,1 , 0,0,2];
	//iso = Crafty.isometric.size(48);
	iso = Crafty.diamondIso.init(48,24,15,15);
	var z = 0;
	for(var i = 0; i < 21; i++) {
		for(var y = 0; y < 21; y++) {
            if (parseInt(Math.random()*3)==1) continue;
			var which = parseInt(Math.random()*12);
			//var which = tilemap[(i*3)+y];
			//var tile = Crafty.e("2D, DOM, testile, Mouse")
			//var tile = Crafty.e("2D, DOM, "+ myTiles[which] +", Mouse");
			var tile = Crafty.e("2D, DOM, tile"+ which);
			/*/
            var tile = Crafty.e("2D, DOM, tile"+ which +", Mouse")
			//.attr('z',i+1 * y+1).areaMap([64,0],[128,32],[128,96],[64,128],[0,96],[0,32]).bind("MouseUp", function(e) {
			//.attr('z',i+1 * y+1).areaMap([0,24],[24,0],[41,24],[24,48]).bind("MouseUp", function(e) {
			//.attr('z',i+1 * y+1)
			//.attr('z', i+1 - y+1 )
			//.attr('transform', '')
			//.areaMap([0,67],[24,55],[47,67],[24,79]).bind("MouseUp", function(e) {
			
			//.areaMap([24, 72], [48, 84], [24, 96], [0,84])
            .bind("MouseUp", function(e) {
			//.areaMap(iso.polygon(80)).bind("MouseUp", function(e) {
                //console.log(iso.polygon(this));
				//alert(e.button);
				//destroy on right click
				//if(e.mouseButton == Crafty.mouseButtons.RIGHT) this.destroy();
			})
			.bind("MouseOver", function(e) {
				this.alpha = 0.5;
				
			}).bind("MouseOut", function() {
				this.alpha = 1;
			});
            tile.areaMap(iso.polygonGrid(tile.h-iso._tile.height));
            //*/
            
            //if ( which == 10 ) tile.alpha = 0.5;
			
			
			//iso.place(coords.x,coords.y,0, tile);
			//iso.place(i,y,0, tile);
			iso.place(tile,i,y,0);
		}
	}
    
	// COMPONENT TEST
	Crafty.c("Isoway", {
		_active: 1,
		_direction: 0, // 0 - 7 
		_lastMove: 0,
		_moveMatrix: [ [0,-1], [1,-1], [1,0], [1,1], [0,1], [-1,1], [-1,0], [-1,-1] ],
		
		init: function() {
			//this.addComponent("Keyboard, Solid, Collision").origin("center");
			//this.collision(new Crafty.polygon([[2,12],[7,5],[16,2],[27,7],[30,13],[29,42],[29,56],[24,65],[7,64],[1,56],[3,39],[2,20]]));
			this.addComponent("Keyboard, Solid");
			
			this.bind("EnterFrame", function() {
				if(!this._active) return;
				/*
				var slide = 0;
				
				//forward
				if(this.isDown(Crafty.keys.W)) {
					this._speed += this._acceleration;
				}
				
				//reverse
				if(this.isDown(Crafty.keys.S)) {
					this._speed -= this._acceleration;
				}
				
				
				//turning
				if(this.isDown(Crafty.keys.A)) {
					this._direction = (this._direction + 1) % 8;
				}
				
				if(this.isDown(Crafty.keys.D)) {
					this._direction = (7 + this._direction) % 8;
				}
				

				this.x += Math.sin(this._rotation * Math.PI / 180) * this._speed;
				this.y += Math.cos(this._rotation * Math.PI / 180) * -this._speed;
				
				//check for collision with houses
				var collision = this.hit("Solid"),
					item, diff, length,
					normal = {x: 0, y: 0};
					
				if(collision) {
					item = collision[0];
					
					normal.x = Math.sin(this._rotation * Math.PI / 180);
					normal.y = Math.cos(this._rotation * Math.PI / 180);
					diff = Math.sqrt(Math.pow(Math.abs(normal.x - item.normal.x), 2) * Math.pow(Math.abs(normal.y - item.normal.y), 2));
					
					//slow down based on the difference between directions
					this._speed = diff;
					
					this.x += Math.ceil(item.normal.x * -item.overlap);
					this.y += Math.ceil(item.normal.y * -item.overlap);
					
				}
				//*/
			}).bind("KeyDown", function(e) {
			//});
			//Crafty.addEvent(this, Crafty.stage.elem, "keypress", function(e) {
			
				//already processed this key event
				if(this.lastMove+100 < e.timeStamp || !this._active) return;
				
				//turning
				if(this.isDown(Crafty.keys.LEFT_ARROW)) {
					this._direction = (6 + this._direction) % 8;
				}
				
				if(this.isDown(Crafty.keys.RIGHT_ARROW)) {
					this._direction = (this._direction + 2) % 8;
				}
				
				//this.removeComponent("mage_0");
				
				switch (this._direction) {
					case 0: this.addComponent("mage_1").unflip("X");
						break;
					case 2: this.addComponent("mage_0").unflip("X"); 
						break;
					case 4: this.addComponent("mage_0").flip("X");
						break;
					case 6: this.addComponent("mage_1").flip("X");
						break;
				}
				
				var pos = iso.px2pos(this.x+12, this.y+48);
				
				// forward
				if(this.isDown(Crafty.keys.UP_ARROW)) {
					iso.place(this, pos.x + this._moveMatrix[this._direction][0], pos.y + this._moveMatrix[this._direction][1], 2);
				
				}
				
				// backward
				if(this.isDown(Crafty.keys.DOWN_ARROW)) {
					iso.place(this, pos.x - this._moveMatrix[this._direction][0], pos.y - this._moveMatrix[this._direction][1], 2);
				}
				
				// Center on character
				Crafty.viewport.scroll("_x", Crafty.viewport._zoom*(-this.x - this.w/2) + Crafty.viewport.width / 2 );
				Crafty.viewport.scroll("_y", Crafty.viewport._zoom*(-this.y - this.h/2) + Crafty.viewport.height / 2 );
				
				
			});
		}
	});
	
	
    // iso cursor =============================================
	//*
    var iso_cursor = Crafty.e("2D, DOM, iso_cursor");
    
    Crafty.addEvent(this, Crafty.stage.elem, "mousemove", function(e) {
        if (_mouseMode!='tile') return;
        var pos = Crafty.DOM.translate( e.clientX , e.clientY  );
		var gc = iso.px2pos(  pos.x,  pos.y );
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
		var pos = Crafty.DOM.translate( e.clientX , e.clientY  );
		var gc = iso.px2pos(  pos.x,  pos.y );
		if (e.button === 0) iso.place( Crafty.e("2D, DOM, tile0"), gc.x, gc.y, 0 );
	});
	
	Crafty.addEvent(this, Crafty.stage.elem, "mouseup", function(e) {
		_button = false;
	});
	//*/
	
	
	// actor =============================================
	var tile = Crafty.e("2D, DOM, mage_1, Mouse, Draggable, Isoway")
		//.multiway({x:2,y:1.5}, {UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180})
		.bind("Dragging", function(e) {
            if (_mouseMode!='actor') return true;
			//var base = {x: e.clientX - Crafty.viewport._x, y: e.clientY - Crafty.viewport._y};
			var pos = Crafty.DOM.translate( e.clientX , e.clientY  );
			var gc = iso.px2pos(  pos.x,  pos.y );
            //console.log(gc);
			//iso.place(gc.x, gc.y, 0, this);
			iso.place(this, gc.x, gc.y, 2);
		});
	//tile.flip("X");
	iso.place(tile, 9, 9, 2);
    // ---
    
    // tree =============================================
    iso.place(Crafty.e("2D, DOM, tree"), 5, 0, 1);
    iso.place(Crafty.e("2D, DOM, tree"), 5, 9, 1);
	// ---
	
	
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
	
    $(".DOM").css({
        '-moz-user-select':'none',
        '-webkit-user-select':'none',
        'user-select':'none',
        '-o-user-select':'none',
        '-ms-user-select':'none'
    });
	//Crafty.e("2D, DOM, Text").attr({ x: 100, y: 100}).text("Look at me!!").attr("z",1000);
    
    // Mouse Zoom ===============
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

    
});

function mouseMode(mode) 
{
    _mouseMode = mode;
}

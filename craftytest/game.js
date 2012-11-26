function mapCoords(xIn,yIn){
    return {
        x:Math.floor((yIn - xIn) /2),
        y:Math.floor(yIn + xIn)
    }
}

$(document).ready(function() {
	Crafty.init();
	Crafty.viewport.init(780, 540);
	Crafty.viewport.scale(1);

	//Crafty.canvas.init();
	Crafty.sprite(48, "images/sprite.png", {
		grass: [0,0,1,2],
		stone: [1,0,1,2],
		wallstone: [2,0,1,2],
		wallwood: [3,0,1,2]
	});
	
	Crafty.sprite(24,'images/char_mage.png', {
		mage_0: [0,0,1,2],
		mage_1: [1,0,1,2]
	});

	var myTiles = ['grass', 'stone', 'wallstone', 'wallwood'];
	var tilemap = [3,0,0 , 0,0,1 , 0,0,2];
	iso = Crafty.isometric.size(48);
	var z = 0;
	for(var i = 0; i < 16; i++) {
		for(var y = 0; y < 16; y++) {
			var coords = mapCoords(i,y);
			var which = parseInt(Math.random()*4);
			//var which = tilemap[(i*3)+y];
			//var tile = Crafty.e("2D, DOM, testile, Mouse")
			var tile = Crafty.e("2D, DOM, "+ myTiles[which] +", Mouse")
			//.attr('z',i+1 * y+1).areaMap([64,0],[128,32],[128,96],[64,128],[0,96],[0,32]).bind("MouseUp", function(e) {
			//.attr('z',i+1 * y+1).areaMap([0,24],[24,0],[41,24],[24,48]).bind("MouseUp", function(e) {
			//.attr('z',i+1 * y+1)
			//.attr('z', i+1 - y+1 )
			//.attr('transform', '')
			.areaMap([0,67],[24,55],[47,67],[24,79]).bind("MouseUp", function(e) {
				//alert(e.button);
				//destroy on right click
				//if(e.mouseButton == Crafty.mouseButtons.RIGHT) this.destroy();
			}).bind("MouseOver", function() {
				this.alpha = 0.5;
				
			}).bind("MouseOut", function() {
				this.alpha = 1;
			});
			
			
			
			iso.place(coords.x,coords.y,0, tile);
			//iso.place(i,y,0, tile);
		}
	}
	
	// actor
	var coords = mapCoords(15,15);
	var tile = Crafty.e("2D, DOM, mage_0, Mouse, Draggable").origin(10,20);
		
	iso.place(coords.x,coords.y,0, tile);
	// ---
	
	Crafty.addEvent(this, Crafty.stage.elem, "mousedown", function(e) {
		if(e.button !== 1) return;
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
	
});
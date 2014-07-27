Crafty.c("Actor", {
	_id: null,
	_direction: 0,
	init: function () {
		this.addComponent("2D, DOM, Mouse, Draggable")
			.bind("Dragging", _actor_onDragging)
			.bind("StopDrag", _actor_onStopDrag);

	}

});

function _actor_onDragging(e) {
	if (Mouse.mode!='actor') return true;
	e.preventDefault();
	var gc = Game.viewport.px2pos(  Crafty.mousePos.x,  Crafty.mousePos.y );
	Game.viewport.place(this, gc.x, gc.y, 2);
}

function _actor_onStopDrag(e) {
	var gc = Game.viewport.px2pos(  Crafty.mousePos.x,  Crafty.mousePos.y );
	var actor = Game.actors[this._id];
	if (gc.x == actor.x && gc.y == actor.y) return; // no change, abort
	
	// check if valid movement
	// should we ignore the check for the DM ?
	if ( !Game.map.canWalk({x:gc.x, y:gc.y}) ) 
	{
		gc.x = actor.x;
		gc.y = actor.y;
	}

	Sender.move(this._id, gc.x, gc.y, this._direction);
}


// Keyboard movement //////////////////////////////////////////////////////
Crafty.c("Isoway", {
	_active: 1,
	//_direction: this.direction || 0, // 0 - 7 
	_lastMove: 0,
	_moveMatrix: [ [0,-1], [1,-1], [1,0], [1,1], [0,1], [-1,1], [-1,0], [-1,-1] ],
	
	
	init: function() {
		this.addComponent("Keyboard, Solid");
		
		this.bind("EnterFrame", function() {
			if(!this._active) return;
			// ...

		}).bind("KeyDown", function(e) {
			if (!Crafty.selected) return;
			if (Mouse.mode!='actor') return;

			e.originalEvent.preventDefault();

			//already processed this key event
			if(this.lastMove+100 < e.timeStamp || !this._active) return;
			
			if ( !this.isDown(Crafty.keys.UP_ARROW) 
				&& !this.isDown(Crafty.keys.DOWN_ARROW) 
				&& !this.isDown(Crafty.keys.LEFT_ARROW) 
				&& !this.isDown(Crafty.keys.RIGHT_ARROW) ) return; // No useful keystroke
			
			var actor = Game.actors[this._id];
			this._direction = actor.angle;

			/* Steering wheel movement
			//turning
			if(this.isDown(Crafty.keys.LEFT_ARROW)) {
				this._direction = (6 + this._direction) % 8;
			}
			
			if(this.isDown(Crafty.keys.RIGHT_ARROW)) {
				this._direction = (this._direction + 2) % 8;
			}
			*/

			var old_direction = this._direction;

			if (this.isDown(Crafty.keys.UP_ARROW)) this._direction = 0;
			if (this.isDown(Crafty.keys.RIGHT_ARROW)) this._direction = 2;
			if (this.isDown(Crafty.keys.DOWN_ARROW)) this._direction = 4;
			if (this.isDown(Crafty.keys.LEFT_ARROW)) this._direction = 6;


	
			switch (this._direction) {
				case 0: this.sprite(0,0);
					break;
				case 2: this.sprite(1,0); 
					break;
				case 4: this.sprite(2,0);
					break;
				case 6: this.sprite(3,0);
					break;
			}
				
			actor.angle = this._direction;
			
			// TODO check movement
			var newPos = { x: actor.x, y: actor.y };

			/* Steering wheel movement
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
			*/

			if (old_direction==this._direction) {
				newPos = {
					x: actor.x + this._moveMatrix[this._direction][0],
					y: actor.y + this._moveMatrix[this._direction][1]
				}
			}
			
			// check if valid movement
			if ( !Game.map.canWalk({x:newPos.x, y:newPos.y}) ) return; // TODO check passage flag
			else
			{
				actor.x = newPos.x;
				actor.y = newPos.y;
			}
			
			iso.place(this, actor.x , actor.y, 2);
			
			// Send the event to the server
			Sender.move(this._id, actor.x, actor.y, this._direction);
			// Center on character
			//Crafty.viewport.scroll("_x", Crafty.viewport._zoom*(-this.x - this.w/2) + Crafty.viewport.width / 2 );
			//Crafty.viewport.scroll("_y", Crafty.viewport._zoom*(-this.y - this.h/2) + Crafty.viewport.height / 2 );
			Game.viewport.centerAt(actor.x, actor.y);
			
		});
	}
});
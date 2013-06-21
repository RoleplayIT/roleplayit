/**
 * Send events to server
 */
var Sender = {
	///////////////////////////////////////////////////////////////
	move: function(id, x, y, angle)
	{
		io.emit('actor:move', {
			id: id, 
			x: x,
			y: y,
			angle: angle
		});
	},
	
	///////////////////////////////////////////////////////////////
	say: function(text)
	{	
		io.emit('say', { 
			data: text
		});
		
	},
	draw: function(map, tileId, layer, x, y)
	{
		io.emit('map:draw', {
			map: map, 
			tileId: tileId,
			layer: layer,
			x: x,
			y: y
		});
	}
	
}
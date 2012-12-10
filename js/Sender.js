/**
 * Send events to server
 */
var Sender = {
	///////////////////////////////////////////////////////////////
	move: function(id, x, y, angle)
	{
		$.ajax({
			type: 'GET',
			url: 'ajax.php',
			data: { 
				cmd: 'move',
				idx: id, 
				x: x,
				y: y,
				angle: angle
			},
			dataType: 'json'
		});
	},
	
	///////////////////////////////////////////////////////////////
	say: function(text)
	{	
		$.ajax({
			type: 'GET',
			url: 'ajax.php',
			data: { 
				cmd: 'say',
				data: text
			},
			dataType: 'json'
		});
		
	}
	
}
$(document).ready(function() {

io.on('actor:move', function(data){
	GameEvents.move(data.id, data.x, data.y, data.angle);
});

io.on('actor:props', function(data){
	if (typeof data == "string") {
		$('#stats .content').html( data.replace(/\n/g,'<br>') );
	}
	// TODO json data case
	// TODO output templates
});

io.on('say', function(data){
	GameEvents.say(data.id, data.name, data.text);
});

io.on('disconnect', function(data){
	// TODO handle disconnections properly
	console.log(data);
	if (data=='unauthorized') {
		// server forced a disconnection, go back to login
		document.location.reload(true);
		io.disconnect();
	}
	if (data=='relogged') {
		$('#modal-message .message').text('Your account logged from another location.');
		$('#modal-message').show();
		io.disconnect();
	}
	if (!data) {
		$('#modal-message .message').text('Connection lost...');
		$('#modal-message').show();
	}
	/*
	*/

});
io.on('connect', function(){
	$('#modal-message').hide();
});

io.on('playerlist', GUI.playerList.update);

io.on('turn:list', GUI.turnOrder.update);

io.on('turn:current', function(data){
	console.log(data);
	$('#turn_order li .isturn').removeClass('yes');
	$('#turn_order li[data-user=' + data + '] .isturn').addClass('yes');
});

io.on('client:isTyping', function(data){
	window._timeouts = window._timeouts || {};
	$('#player_list li[data-user=' + data + '] .istyping').addClass('yes');
	clearTimeout(_timeouts[data]);
	window._timeouts[data] = setTimeout(function() {
		$('#player_list li[data-user=' + data + '] .istyping').removeClass('yes');
	}, 5000);
});

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

	if (Game.useFoVOverride!==null ? Game.useFoVOverride : Game.useFoV) Viewport.updateFoV();
	
	Viewport.update();
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
	
	Viewport.setMode(Game.map.viewMode);

	if (Game.useFoVOverride!==null ? Game.useFoVOverride : Game.useFoV) Viewport.updateFoV();
	
	Viewport.update();
});

io.on('dice:request', function(data) {
	console.log(data)
	console.log(Game.userID);
	if (data.user == Game.userID) {
		GUI.rollRequestDialog.set(data);
	}
});

io.on('sync', function(data) {
	// TODO rewrite to handle things properly

	// unwrap data
	Game.userID = data.userID;
	Game.accessLevel = data.accessLevel;
	Game.currentActor = data.currentActor;
	//console.log(data);
	Tilesets = data.tilesets;
	TileFlag  = data.tileFlag;
	TileFlags = data.tileFlags;
	loadBodysets(data.bodysets);
	Bodysets  = data.bodysets;

	if (Game.accessLevel>0) {
		Game.useFoV = false;
		Game.fogOfWar = false;
	}

	loadTileset(Tilesets[0], 'isometric');  //FIXME
						
	//var actors = data.actors;

	Viewport.updateActors(data.actors);

	

	Game.setInteractionMode('actor');

});


});

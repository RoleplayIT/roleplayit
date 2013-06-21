var fs = require('fs'),
	_  = require('underscore');

(function() {
	var _maps = [];
	var Maps = {};

	function getLastId() {
		var count = _maps.length;
		var lastId = 0;
		
		for (i=0; i<count; i++) {
			if (_maps[i].id > lastId) lastId = _maps[i].id;
		}
		
		return lastId + 1;
	}

	/**
	 *	Initialize the tilemap of a map
	 */
	Maps.resetMap = function(map, width, height) {
		if (!width || !height) {
			width = map.width;
			height = map.height;
		}

		map.tilemap = [];

		for (var layer=0; layer < 2; layer++) {
			map.tilemap[layer] = [];
			for (var i=0; i < width; i++) {
				map.tilemap[layer][i] = [];
			
				for (var j=0; j < height; j++) {
					map.tilemap[layer][i][j] = null;
				}
			}
		}
	}

	/**
	 *	Returns an Array of all maps
	 */
	Maps.getMaps = function() {
		return _maps;
	}

	/**
	 *	Create a new map
	 */
	Maps.create = function(args) {
		var defaults = {
			id: getLastId(),
			name: "New map",
			width:  15,
			height: 15,
			tilemap: null 
		};
		var map = _.defaults(defaults, args);
		_maps[_maps.length] = map;

		if (map.tilemap == null) Maps.resetMap(map);

		return map;
	}

	/**
	 *	Remove a map
	 */
	Maps.remove = function(id) {
		var i = 0,
			max = _maps.length;

		while(i++ < max) {
			if (_maps[i] && _maps[i].id == id) {
				_maps[i].deleted = true;
				_maps = _.without(_maps, _maps[i]); //_maps[i] = null;
				return true;
			}
		}

		return false;
		
	}

	/**
	 *	Returns a map by id
	 */
	Maps.getById = function(id) {
		return _.findWhere(_maps, {id: id});
	}

	/**
	 *	Draw one or more tiles on the map
	 */
	Maps.draw = function(map, tileId, layer, x, y) {
		// check for invalid coordinates
		if (x<0 || x>= map.width || y<0 || y>= map.height ) return;

		// array of tiles
		if (Array.isArray(tileId)) {
			var count = tileId.length;
			for (i=0;i<count;i++) map.tilemap[layer][tileId[i][1]][tileId[i][2]] = tileId[i][0];
		}
		else { // single tile
			map.tilemap[layer][x][y] = tileId;
		}
		/*
			tile { map, tiledId, x, y}

			or 

			segment {x,y, width, height, tiledata[]}
		*/

	}


	Maps.serialize = function() {
		try {
			fs.writeFile('./save/maps.json', JSON.stringify(_maps));
			console.log('Maps: Saving...done');
		}
		catch (err) {
			console.log('Maps: Saving...error - ' + err);
		}
	}

	Maps.deserialize = function() {
		var fs_maps = fs.readFileSync('./save/maps.json');
		try {
			_maps = JSON.parse(fs_maps);
			console.log('Maps: Loading...done');
		}
		catch (err) {
			console.log('Maps: Loading...error - ' + err);
		}
	}

	module.exports = Maps;

}).call(this);

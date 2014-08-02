var fs = require('fs'),
	_  = require('underscore');

(function() {

	var _tilesets = [];
	var Tilesets = {
		//Tiles: [],
		Tileset: {}, // hashmap
		TileFlag: {
				Impassable: 0x01,
				BlockLOS: 0x02
			}
	}

	Tilesets.getTilesets = function() {
		return _tilesets;
	}

	Tilesets.serialize = function() {
		try {
			fs.writeFile('./save/tilesets.json', JSON.stringify(_tilesets, null, '\t'));
			console.log('Tilesets: Saving...done');
		}
		catch (err) {
			console.log('Tilesets: Saving...error - ' + err);
		}
	}

	Tilesets.deserialize = function() {
		var fs_tilesets = fs.readFileSync('./save/tilesets.json');
		try {
			_tilesets = JSON.parse(fs_tilesets);
			extrapolateTilesets();
			console.log('Tilesets: Loading...done');
		}
		catch (err) {
			console.log('Tilesets: Loading...error - ' + err);
		}
	}

	function extrapolateTilesets() {
		var count = _tilesets.length;
		for (var i=0;i<count;i++) {
			var ts =_tilesets[i];
			Tilesets.Tileset[ts.id] = { TileFlags: [3] };
			for (var j=0;j<ts.groups.length;j++) {
				var group = ts.groups[j];
				var gid = group.firstgid;
				var flags = group.flags;
				for (var k=0;k<flags.length;k++) {
					//Tilesets.Tiles
					Tilesets.Tileset[ts.id].TileFlags[gid++] = flags[k];
				}
			}
		}
	}

	module.exports = Tilesets;

}).call(this);

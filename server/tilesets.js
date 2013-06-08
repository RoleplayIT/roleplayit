var fs = require('fs'),
	_  = require('underscore');

(function() {

	var _tilesets = [];
	var Tilesets = {
		//Tiles: [],
		TileFlags: [3],
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
			fs.writeFile('./save/tilesets.json', JSON.stringify(_maps, _tilesets, '\t'));
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
		for (i=0;i<count;i++) {
			var ts =_tilesets[i];
			var gid = ts.firstgid;
			var flags = ts.flags;
			for (j=0;j<flags.length;j++) {
				//Tilesets.Tiles
				Tilesets.TileFlags[gid++] = flags[j];
			}
		}
	}

	module.exports = Tilesets;

}).call(this);

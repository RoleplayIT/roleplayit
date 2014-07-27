Map = function (width, height) { 
	var layers = 2;
	// public variables
	this.id = null;
	this.name = '';
	this.width = width;
	this.height = height;
	this.tilemap = [[],[]];	// tile map, two layers, 2d array
	this.tilemap_e = [[],[]]; // crafty entities
	this.visited = [];
	this.fov = [];
	
	// public methods
	this.canSee = function (coord) {
		if ( coord.x > this.width-1 || coord.x < 0 ) return false; // x out of bounds
		if ( coord.y > this.height-1 || coord.y < 0 ) return false; // y out of bounds

		return !(TileFlags[this.tilemap[0][coord.x][coord.y]] & TileFlags[this.tilemap[1][coord.x][coord.y]] & TileFlag.BlockLOS);
		
	}
	
	this.canWalk = function (coord) {
		if ( coord.x > this.width-1 || coord.x < 0 ) return false; // x out of bounds
		if ( coord.y > this.height-1 || coord.y < 0 ) return false; // y out of bounds

		if (TileFlags[this.tilemap[1][coord.x][coord.y]] == 0)
			return !(TileFlags[this.tilemap[0][coord.x][coord.y]] & TileFlag.Impassable);
		else
			return !(TileFlags[this.tilemap[0][coord.x][coord.y]] & TileFlags[this.tilemap[1][coord.x][coord.y]] & TileFlag.Impassable);

	}

	this.destroy = function () {
		this.id = null;
		this.name = null;
		this.width = null;
		this.height = null;
		this.tilemap = null;
		this.visited = null;
		this.fov = null;
		
		// destroy crafty entities
		for(layer=0;layer<Game.map.tilemap_e.length;layer++) {
			for(i=0;i<Game.map.tilemap_e[layer].length;i++) {
				entities = this.tilemap_e[layer][i];
				for(j=0;j<entities.length;j++) {
					if (entities[j]) {
						entities[j].destroy();
						entities[j] = null;
					}
				}
			}
		}
	}
	
	// constructor routine
	for (var layer=0; layer < layers; layer++) {
		for (var i=0; i < width; i++) {
			this.tilemap[layer][i] = [];
			this.tilemap_e[layer][i] = [];
			this.visited[i] = [];
			this.fov[i] = [];
			
			for (var j=0; j < height; j++) {
				//this.tilemap[layer][i][j] = false;
				this.tilemap[layer][i][j] = null;
				this.visited[i][j] = false;
				this.fov[i][j] = false;
			}
		}
	}


	
};
Map = function (width, height) { 
	var layers = 2;
	// public variables
	this.id = null;
	this.name = '';
	this.width = width;
	this.height = height;
	this.tilemap = [];	// tile map, two layers, 2d array
	this.tilemap[0] = [];
	this.tilemap[1] = [];
	this.tilemap_e = []; // crafty entities
	this.tilemap_e[0] = []; 
	this.tilemap_e[1] = []; 
	this.visited = [];
	this.fov = [];
	
	// public methods
	this.canSee = function (coord) {
		try {

			return !(TileFlags[this.tilemap[0][coord.x][coord.y]] & TileFlag.BlockLOS) || !(TileFlags[this.tilemap[1][coord.x][coord.y]] & TileFlag.BlockLOS);
			
		}
		catch (e) { return; false; }
	}
	
	this.canWalk = function (coord){
		try {

			return (TileFlags[this.tilemap[0][coord.x][coord.y]] & TileFlag.Impassable) & (TileFlags[this.tilemap[1][coord.x][coord.y]] & TileFlag.Impassable);
		}
		catch (e) { return; false; }
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
Map = function (width, height) { 
	// public variables
	this.id = null;
	this.name = '';
	this.width = width;
	this.height = height;
	this.tilemap = [];	// tile map, 2d array
	this.tilemap_e = []; // crafty entities
	this.visited = [];
	this.fov = [];
	
	// public methods
	this.canSee = function (coord) {
		try {
			
			return !(TileFlags[this.tilemap[coord.x][coord.y]] & TileFlag.BlockLOS);
			
		}
		catch (e) { return; false; }
	}
	
	this.canWalk = function (coord){
		try {
			return (TileFlags[this.tilemap[coord.x][coord.y]] & TileFlag.Impassable);
		}
		catch (e) { return; false; }
	}
	
	// constructor routine
	for (var i=0; i < width; i++) {
		this.tilemap[i] = [];
		this.tilemap_e[i] = [];
		this.visited[i] = [];
		this.fov[i] = [];
		
		for (var j=0; j < height; j++) {
			this.tilemap[i][j] = false;
			this.tilemap[i][j] = null;
			this.visited[i][j] = false;
			this.fov[i][j] = false;
		}
	}


	
};
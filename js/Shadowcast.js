// Routine translated from java ( https://bitbucket.org/ido.yehieli/hexrl/src/4245c067143e/src/fov/Shadowcast.java?at=default )
Shadowcast = {
	
	fov : [],
	circular: false, // bool
	
	Shadowcast: function (circular) {
		this.circular = circular;
	},
	
	calcFoV: function (world, x, y, range) {
		this.fov = [];
		var orig = {x: x, y: y};
		this.fov.push(orig);

		for (var octant = 1; octant <= 8; octant++)
				Shadowcast.scan(1, 1.0, 0.0, orig, this.fov, world, range, octant);
		// todo
		//if (circular)
		//		Tools.filterCircle(fov, x, y, range);
		return this.fov;
	},

	translate: function ( coord, _x,_y) {
		coord.x += _x;
		coord.y += _y;
		return coord;
	},
	
	getCurr: function (orig, x, y, octant) {
			switch (octant) {
			case 1:
					return { x: orig.x + x, y: orig.y + y};
			case 2:
					return { x: orig.x + x, y: orig.y - y};
			case 3:
					return { x: orig.x + y, y: orig.y + x};
			case 4:
					return { x: orig.x - y, y: orig.y + x};
			case 5:
					return { x: orig.x - x, y: orig.y + y};
			case 6:
					return { x: orig.x - x, y: orig.y - y};
			case 7:
					return { x: orig.x + y, y: orig.y - x};
			case 8:
					return { x: orig.x - y, y: orig.y - x};
			default:
					throw "octant must be between 1 and 8";
			}
	},

	getPrev: function (orig, x, y, octant, world) {
		var curr = Shadowcast.getCurr(orig, x, y, octant);
		if (curr.x == 0 || curr.y == 0 || curr.x == world.width - 1
						|| curr.y == world.height - 1)
				return curr;
		switch (octant) {
		case 1:
				return Shadowcast.translate(curr, 0, 1);
		case 2:
				return Shadowcast.translate(curr, 0, -1);
		case 3:
				return Shadowcast.translate(curr, 1, 0);
		case 4:
				return Shadowcast.translate(curr, -1, 0);
		case 5:
				return Shadowcast.translate(curr, 0, 1);
		case 6:
				return Shadowcast.translate(curr, 0, -1);
		case 7:
				return Shadowcast.translate(curr, 1, 0);
		case 8:
				return Shadowcast.translate(curr, -1, 0);
		default:
				throw "octant must be between 1 and 8";
		}
	},

	newEndslope: function (depth,  y) {
		return Shadowcast.getSlope(depth - .5, y + .5);
	},

	newStartslope: function (depth, endslope, y) {
		return Math.max(Shadowcast.getSlope(depth +.25, y+.25 ), endslope);
	},

	scan: function (depth, startslope, endslope, orig, fov, world, range, octant) {

		if (depth > range)
				return;
		
		var y = Math.round(startslope * depth);
		while (Shadowcast.getSlope(depth, y) >= endslope) {
			var curr = Shadowcast.getCurr(orig, depth, y, octant);
			if ( Shadowcast.inRange(curr.x, curr.y, orig.x, orig.y, range) ) {
				var prev = Shadowcast.getPrev(orig, depth, y, octant, world);
			
				if (world.canSee(curr) && !world.canSee(prev)) {
					startslope = Shadowcast.newStartslope(depth, endslope, y);
				}
				
				if (!world.canSee(curr) && world.canSee(prev)) {
					Shadowcast.scan(depth + 1, startslope, Shadowcast.newEndslope(depth, y), orig, fov, world, range, octant);
				}
				
				if (curr.x >= 0 && curr.y >= 0 && curr.x < world.width && curr.y < world.height)
					fov.push(curr);
			}
			y--;
		}
		y++;
		if (world.canSee(Shadowcast.getCurr(orig, depth, y, octant)))
				Shadowcast.scan(depth + 1, startslope, endslope, orig, fov, world, range, octant);
	},

	getSlope: function (x, y) {
		if (x == 0)
			return Number.MAX_VALUE;
		return (y) / (x);
	},
	
	inRange: function (_x1, _y1, _x2, _y2, range)
	{
		
		if (_x1 == _x2) //if they're on the same axis, we only need to test one
		//value, which is computationaly cheaper than what we do below
		{
			return Math.abs(_y1 - _y2 ) <= range;
		}

		if (_y1 == _y2)
		{
			return Math.abs(_x1 - _x2) <= range;
		}

		return (Math.pow((_x1 - _x2), 2) + Math.pow((_y1 - _y2), 2)) <= Math.pow(range+.25, 2);

	}
	
};

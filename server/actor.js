var fs = require('fs'),
	_  = require('underscore');

(function() {
	var _actors = [];
	var Actor = {};

	function getLastId() {
		var count = _actors.length;
		var lastId = 0;
		
		for (i=0; i<count; i++) {
			if (_actors[i].id > lastId) lastId = _actors[i].id;
		}
		
		return lastId + 1;
		

	}


	/**
	 *	Returns an Array of all actors
	 */
	Actor.getActors = function() {
		return _actors;
	}

	/**
	 *	Create a new actor
	 */
	Actor.create = function(args) {
		var defaults = {
			id: getLastId(),
			body: 1,
			owner: null,
			map: null,
			x: 0,
			y: 0,
			angle: 0
		};
		var actor = _.defaults(defaults, args);
		_actors[_actors.length] = actor;
		return actor;
	}

	/**
	 *	Remove an actor
	 */
	Actor.remove = function(id) {
		var i = 0,
			max = _actors.length;

		while(i++ < max) {
			if (_actors[i] && _actors[i].id == id) {
				_actors[i].deleted = true;
				_actors = _.without(_actors, _actors[i]); //_actors[i] = null;
				return true;
			}
		}

		return false;
		
	}

	/**
	 *	Move an actor
	 */
	Actor.move = function(actor, x, y, angle, map) {
		if (actor && actor.deleted) return;

		if (typeof x != 'undefined' && typeof y != 'undefined') { 
			actor.x = x;
			actor.y = y;
		}
		if (typeof angle != 'undefined') actor.angle = angle;
		if (typeof map  != 'undefined') actor.angle = map;
	}

	/**
	 *	Returns an actor by id
	 */
	Actor.getById = function(id) {
		return _.findWhere(_actors, {id: id});
	}
	
	/**
	 *	Returns an actor by owner
	 */
	Actor.getByOwner = function(user) {
		return _.findWhere(_actors, {owner: user});
	}

	Actor.serialize = function() {
		try {
			fs.writeFile('./save/actors.json', JSON.stringify(_actors, null, '\t'));
			console.log('Actors: Saving...done');
		}
		catch (err) {
			console.log('Actors: Saving...error - ' + err);
		}
	}

	Actor.deserialize = function() {
		var fs_actors = fs.readFileSync('./save/actors.json');
		try {
			_actors = JSON.parse(fs_actors);
			console.log('Actors: Loading...done');
		}
		catch (err) {
			console.log('Actors: Loading...error - ' + err);
		}
	}

	module.exports = Actor;

}).call(this);

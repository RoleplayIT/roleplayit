var crypto  = require('crypto'),
	_       = require('underscore'),
	Actors	= require('./actor'),
	Dice    = require('./dice'),
	Maps    = require('./map'),
	Tilesets= require('./tilesets'),
	Bodysets= require('./bodysets'),
	Users	= require('./users');

var AccessLevel = Users.AccessLevel;

module.exports = (function(io) {
	function checkAccessLevel(netState, level) {
		if (netState.session.accessLevel>=level) return true;
		return false;
	}
	
	// Route bindings
	io.route('actor', {
		move: function(req) {
			
			var actor = Actors.getById(req.data.id);
			if (actor) {
				var to = req.data;
				// Map.checkMovement(actor.map, to.x, to,y);
				//if (checkAccessLevel(req, AccessLevel.Administrator)) {
					Actors.move(actor, to.x, to.y, to.angle, to.map);

				//}
				var data = {
					id: actor.id,
					x: actor.x,
					y: actor.y,
					angle: actor.angle,
					map: actor.map
				}
				io.broadcast('actor:move', data);

			}
		},
		remove: function(req) {
			io.broadcast('actor:remove', req.data);
		}
	})

	io.route('client', {
		updateCursor: function(req) {
			var data = req.data;
			data.id = req.session.username;
			io.broadcast('client:updateCursor', data);
			console.log(data);
		},
		isTyping: function(req) {
			io.broadcast('client:isTyping', req.data);	
		}
	})

	io.route('login', function(req) {
		var users = Users.getUsers();
		var username = req.data.username;
		var md5pwd = crypto.createHash('md5').update(req.data.password).digest("hex")

		if (users[username] && users[username].password == md5pwd) {
			req.session.username = username;
			req.session.accessLevel = users[username].access_level;
			console.log("User '" + username + "' log in success");
			return req.io.emit('login:ok' );
		}
		else {
			console.log("User '" + username + "' log in fail");
			return req.io.emit('login:fail');
		}
	})

	io.route('check', function(req) {
		console.log(req.session.accessLevel);
	})

	io.route('sync', function(req) {
		//console.log(req.session.accessLevel);
		console.log('sync');
		var actor = Actors.getByOwner(req.session.username);
		req.io.emit('sync', {
			userID: req.session.username,
			currentActor: actor?actor.id:null,
			tilesets: Tilesets.getTilesets(),
			tileFlag: Tilesets.TileFlag,
			tileFlags: Tilesets.TileFlags,
			bodysets: Bodysets.getBodysets(),
			actors: Actors.getActors() // TODO send only those that can be seen
		});
	})

	io.route('map:get', function(req) {
		console.log('map:get');
		req.io.emit('map:load', Maps.getMaps()[0]);
	})

	io.route('say', function(req) {
		var username = req.session.username;
		var actor = Actors.getByOwner(req.session.username); 
		var text = req.data.text;
		var data = {
			id: (actor ? actor.id : -1),
			name: (actor ? actor.name : username),
			text: text
		};
		console.log(data);
		io.broadcast('say', data);
	})

	io.route('dice:roll', function(req) {
		var username = req.session.username;

		if (checkAccessLevel(req, AccessLevel.Administrator)) {
			// admins roll what they want
			io.broadcast('say', {
				id: -1,
				name: username,
				text: 'rolls ' + req.data.dice + ': ' + Dice.roll(req.data.dice)
			});
		}
		else {
			// plebs have to comply to roll requests
			var roll = Dice.execRollRequest(username);
			if (roll) {
				var actor = Actors.getByOwner(username); 
				io.broadcast('say', {
					id: (actor ? actor.id : -1),
					name: (actor ? actor.name : username),
					text: 'rolls ' + roll.dice + ': ' + Dice.roll(roll.dice)
				});
			}
		}

	});

	io.route('dice:request', function(req) {
		if (checkAccessLevel(req, AccessLevel.Administrator)) {
			var data = req.data;
			var rollRequest = Dice.request(data.user, data.dice, data.description);
			io.broadcast('dice:request', rollRequest);
		}
	});
	
	io.route('map', {
		draw: function(req) {
			//console.log('map:draw');
			var map = Maps.getById(req.data.map);
			if (map) {
				var tile = req.data;
				// Map.checkMovement(actor.map, to.x, to,y);
				//if (checkAccessLevel(req, AccessLevel.Administrator)) {
					Maps.draw(map, tile.tileId, tile.layer, tile.x, tile.y);

				//}
				/*
				var data = {
					map: tile.map, 
					tileId: tile.tileId,
					x: tile.x,
					y: tile.y
				}
				io.broadcast('map:update', data);
				*/
				// TODO broadcast only to those in the current map
				io.broadcast('map:update', Maps.getMaps()[0]);

			}
		}
	})


})
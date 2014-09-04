var Actor = require('./actor'),
	Users = require('./users'),
	_     = require('underscore'),
	io    = global.Server.io;

(function() {
	PlayerList = {};
	PlayerList.activePlayers = {};

	/**
	 *	Add an user
	 */
	PlayerList.add = function(user) {
		if (this.activePlayers.user) return;

		var actor = Actor.getByOwner(user);

		this.activePlayers[user] = {
			actor  : (actor ? actor.id : null),
			name   : (actor ? actor.name : user),
			acl    : Users.find(user).access_level
		}

		io.sockets.emit('playerlist', this.activePlayers);
	}

	/**
	 *	Remove an user
	 */
	PlayerList.remove = function(user) {
		if (this.activePlayers[user]) delete this.activePlayers[user];
		io.sockets.emit('playerlist', this.activePlayers);
	}

	module.exports = PlayerList;

}).call(this);

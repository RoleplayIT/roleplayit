var Actor = require('./actor'),
	_     = require('underscore'),
	io    = global.Server.io;

(function() {
	TurnHandler = {};
	TurnHandler.list = [];

	var currentTurn = 0;

	function _invalidate() {
		io.sockets.emit('turn:list', TurnHandler.list);
		io.sockets.emit('turn:current', TurnHandler.list[currentTurn].actor);
	}

	/**
	 *	Add an user to the turn order
	 */
	TurnHandler.add = function(actor_id) {
		if ( _.findWhere(this.list,{actor:actor_id}) ) return; // already there

		var actor = Actor.getById(actor_id);
		if (!actor) return;

		this.list.push({
			actor : actor.id,
			name : actor.name, // TODO what if it changes name
			skipTurns : 0
		});

		_invalidate();
	}

	/**
	 *	Remove an actor from the turn order
	 */
	TurnHandler.remove = function(actor_id) {
		var toRemove = _.findWhere(this.list, {actor:actor_id});
		if (toRemove) {
			var toRemoveIndex = _.indexOf(this.list, toRemove);
			console.log('oldTurn: ', currentTurn);
			if (currentTurn>toRemoveIndex) currentTurn = (currentTurn+this.list.length-1)%this.list.length;
			this.list = _.without(this.list, toRemove);
			if (currentTurn==this.list.length) currentTurn = 0; // if the removed was in last position
			console.log('newTurn: ', currentTurn);
		}

		_invalidate();
	}

	/**
	 *	Change the turn order
	 */
	TurnHandler.setOrder = function(new_order) {
		var currentTurnActor = TurnHandler.list[currentTurn];
		this.list = _.sortBy(this.list, function(item){return _.indexOf(new_order,item.actor);}) 
		currentTurn = _.indexOf(this.list, currentTurnActor);
		if (currentTurn == -1) currentTurn  = 0; // if this line happens something went horribly wrong

		_invalidate();
	}

	/**
	 *	Set how may turns to skip
	 */
	TurnHandler.setSkip = function(actor_id, skip_turns) {
		if ( _.findWhere(this.list,{actor:actor_id}) ) return;
		if (skip_turns==null || skip_turns<0) skip_turns = 0;
		var entry = _.findWhere(this.list, {actor:actor_id});
		if (entry) entry.skipTurns = skip_turns;

		_invalidate();
	}

	/**
	 *	Next turn
	 */
	TurnHandler.next = function() {
		if (this.list.length===0) return;

		console.log('TurnHandler.current: ', currentTurn);
		currentTurn = (currentTurn+1) % this.list.length;
		console.log('TurnHandler.next: ', currentTurn);
		if ( this.list[currentTurn].skipTurns > 0 ) {
			this.list[currentTurn].skipTurns--;
			this.next();
			return;
		}

		_invalidate();
	}

	/**
	 *	Get turn tracker list
	 */
	TurnHandler.get = function() {
		_invalidate(); // FIXME do it personal
	}

	/**
	 *	Get the current turn's actor 
	 */
	TurnHandler.current = function() {
		if (this.list.length==0) return;
		return this.list[currentTurn];
	}

	module.exports = TurnHandler;

}).call(this);

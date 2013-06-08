var fs = require('fs'),
	_  = require('underscore');

(function() {
	var _rollRequest = [];

	var Dice = {
		/**
		 *	Roll the dice [dice]d[faces]+[modifier] or "1d4+12"
		 */
		roll: function(dice, faces, modifier) {
			if (typeof dice == 'string') {
				var re_dice = /^(\d+)d(\d+)([\-\+]\d+)?$/;
				var matches = re_dice.exec(dice);
				dice = matches[1];
				faces = matches[2];
				modifier = (matches[3]? parseInt(matches[3]) : 0);
			}
			if (!modifier) modifier = 0;
			var roll = 0;
			for (var i=1;i<=dice;i++) roll += Math.ceil(faces*Math.random());
			roll += modifier;
			return roll;
		},

		request: function(who, dice, description) {
			var userRequest = _.findWhere(_rollRequest, { user: who });
			if (userRequest) {
				// update
				userRequest.dice = dice; 
				userRequest.description = description;

			}
			else {
				// add new request
				_rollRequest.push(userRequest = { user: who, dice: dice, description: description});
			}
			// TODO send only to specified client
			return userRequest;
			
		},

		removeRequest: function(user) {
			_rollRequest = _.without(_rollRequest, _.findWhere(_rollRequest, {user: user}));
		},

		execRollRequest: function(user) {
			var userRequest = _.findWhere(_rollRequest, { user: user });
			if (userRequest) {
				//var roll = this.roll(userRequest.dice);
				this.removeRequest(user);
				return userRequest;
			}
			return false;
		}
	};

	module.exports = Dice;

}).call(this);

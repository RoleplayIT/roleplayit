var fs = require('fs'),
	_  = require('underscore');

(function() {

	var _bodysets = [];
	var Bodysets = {};


	Bodysets.getBodysets = function() {
		return _bodysets;
	}

	Bodysets.serialize = function() {
		try {
			fs.writeFile('./save/bodysets.json', JSON.stringify(_bodysets, null, '\t'));
			console.log('Bodysets: Saving...done');
		}
		catch (err) {
			console.log('Bodysets: Saving...error - ' + err);
		}
	}

	Bodysets.deserialize = function() {
		var fs_bodysets = fs.readFileSync('./save/bodysets.json');
		try {
			_bodysets = JSON.parse(fs_bodysets);
			console.log('Bodysets: Loading...done');
		}
		catch (err) {
			console.log('Bodysets: Loading...error - ' + err);
		}
	}

	module.exports = Bodysets;

}).call(this);

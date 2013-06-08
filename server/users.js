var fs      = require('fs'),
	_       = require('underscore'),
	crypto  = require('crypto');

(function() {
	var _users = {};
	var User = {};

	User.AccessLevel = {
		User: 0,
		Administrator: 1
	}

	/**
	 *	Returns a Collection of all users
	 */
	User.getUsers = function() {
		return _users;
	}

	/**
	 *	Create a new user
	 */
	User.create = function(username, password, accessLevel) {
		if (_users[username]) return false;
		var user = _users[username] = {
			password: crypto.createHash('md5').update(password).digest("hex"),
			access_level: (accessLevel ? accessLevel : 0)
		}
		return user;
	}

	/**
	 *	Remove an user
	 */
	User.remove = function(user) {
		return delete _users.user;
	}

	/**
	 *	Change password
	 */
	User.setPassword = function(user, password) {
		if (_users[username]) return false;
		_users[username].password = crypto.createHash('md5').update(password).digest("hex");
	}

	/**
	 *	Returns a user by username
	 */
	User.find = function(username) {
		return _users[username];
	}

	User.serialize = function() {
		try {
			fs.writeFile('./save/users.json', JSON.stringify(_users, null, '\t'));
			console.log('Users: Saving...done');
		}
		catch (err) {
			console.log('Users: Saving...error - ' + err);
		}
	}

	User.deserialize = function() {
		var fs_users = fs.readFileSync('./save/users.json');
		try {
			_users = JSON.parse(fs_users);
			console.log('Users: Loading...done');
		}
		catch (err) {
			console.log('Users: Loading...error - ' + err);
		}
	}

	module.exports = User;

}).call(this);

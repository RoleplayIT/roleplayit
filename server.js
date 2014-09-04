var express  = require('express.io'),
	app      = require('express.io')(),
	fs       = require('fs'),
	os       = require('os'),
	crypto   = require('crypto'),
	_        = require('underscore'),
	Actors	 = require('./server/actor'),
	Dice	 = require('./server/dice'),
	Users	 = require('./server/users'),
	Maps	 = require('./server/map'),
	Tilesets = require('./server/tilesets'),
	Bodysets = require('./server/bodysets');


app.http().io();

// Setup your sessions, just like normal.
app.use(express.cookieParser())
app.use(express.session({secret: 'rocket propelled grenade', key: 'express.sid', cookie  : {maxAge : 60 * 60 * 1000}}))
app.use(express.bodyParser());

///////////////////////////////////////////////////////////////////////////////
// Variables
store = {};


config = {
	port: 7076
};

//console.log('[RoleplayIt alpha]');

///////////////////////////////////////////////////////////////////////////////
// Helpers
Array.prototype.findKey = function(key, value) {
	return this.filter(function(element){ return element[key] == value;});
}

///////////////////////////////////////////////////////////////////////////////
// Server object
Server = {
	onlineUsers: 0,
	clients: {},
	io: app.io
}

/// Serialize app state
Server.save = function() {
	Users.serialize();
	Tilesets.serialize();
	Bodysets.serialize();
	Maps.serialize();
	Actors.serialize();	
}

// Deserialize app state
Server.load = function() {
	Users.deserialize();
	Tilesets.deserialize();
	Bodysets.deserialize();
	Maps.deserialize();
	Actors.deserialize();

	
	store.users  = Users.getUsers();
	store.actors = Actors.getActors();
	store.maps   = Maps.getMaps();
	
	// TODO force all clients to resync
}

Server.restart = function() {
	// TODO
}

function initialize() {
	// load data
	Server.load();

	// app state
	require('./server/eventhandler')(app.io);

	// what else
}


///////////////////////////////////////////////////////////////////////////////
// Initialize
initialize();


///////////////////////////////////////////////////////////////////////////////
// HTTP server
app.get('/', function(req, res, next){   
	if(req.session.username) {
		//res.send('welcome ' + req.session.username + ' Click to <a href="/forget">forget</a>!.');
		//res.sendfile(__dirname + '/client.html');
		if (req.session.accessLevel == 1)
			res.sendfile(__dirname + '/client/client-dm.html');
		else
			res.sendfile(__dirname + '/client/client-player.html');

		// TODO check accesslevel to show proper page
	} else {
		res.send('<form method="post">'
		+ '<p>Username : <label><input type="text" name="username"/></label>'
		+ '<p>Password : <label><input type="password" name="password"/></label>'
		//+ '<p><label><input type="checkbox" name="remember"/> remember me</label></p> '
		+ '<p><input type="submit" value="Submit"/></p></form>');
	}
});

// Handle login
app.post('/', function(req, res){
	var username = req.body.username;
	var md5pwd = crypto.createHash('md5').update(req.body.password).digest("hex")

	if (store.users[username] && store.users[username].password == md5pwd) {
		req.session.username = username;
		req.session.accessLevel = store.users[username].access_level;

		console.log('Login: '+ req.ip +": Valid credentials for '" + username + "'");
	}
	else {
		console.log('Login: '+ req.ip +": Access denied for '" + username + "'");
	}

	res.redirect('back');

});

app.get('/logout', function(req, res, next){
	req.session.destroy();
	res.redirect('back');

});

app.get('/style.css', function(req, res, next){   
	res.sendfile(__dirname + '/client/css/style.css');
})
app.use('/public', express.static(__dirname + "/public"));
app.use('/js',     express.static(__dirname + "/client/js"));
app.use('/gfx',    express.static(__dirname + "/client/gfx", { maxAge: 3600 }));
app.use('/images', express.static(__dirname + "/client/images", { maxAge: 3600 }));
app.use('/css',    express.static(__dirname + "/client/css"));
app.listen(config.port);

function writeAddresses() {
	var interfaces = os.networkInterfaces();
	for (k in interfaces) {
		for (k2 in interfaces[k]) {
			var address = interfaces[k][k2];
			//if (address.family == 'IPv4' && !address.internal) {
			if (address.family == 'IPv4') {
				console.log('Listening: ' + address.address + ':' + config.port)
			}
		}
	}
}
writeAddresses();


var repl = require("repl");
repl.start({
	prompt: "> ",
	input: process.stdin,
	output: process.stdout
});
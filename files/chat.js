var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

var users = {};

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.get('/styles.css', function(req, res) {
	res.sendFile(__dirname + '/styles.css');
});

app.get('/favicon.png', function(req, res) {
	res.sendFile(__dirname + '/favicon.png');
});

io.on('connection', function(client) {

	client.on('connect', function(userName) {
		users[client.id] = userName;
		client.emit('update', 'Connected to server...');
		io.emit('update', userName + ' connected');
		io.emit('update-users', users);
	});

	client.on('disconnect', function() {
		io.emit('update', users[client.id] + ' disconnected');
		delete users[client.id];
		io.emit('update-users', users);
	});

	client.on('message', function(msg) {
		let time = moment(msg.time).format('MMM Do h:mm a');

		if (moment().isSame(moment(msg.time), 'day')) {
			time = moment(msg.time).format('h:mm a');
		} else if (moment().subtract(1, 'day').isSame(moment(msg.time), 'day')) {
			time = 'Yesterday ' + moment(msg.time).format('h:mm a');
		}

		io.emit('message', users[client.id], msg);
		io.emit('timeStamp', time);
	});
});

http.listen(3000, function() {
	console.log('Server started! Listening on port 3000');
});

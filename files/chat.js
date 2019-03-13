var moment = require('moment');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

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

io.on('connection', function(socket) {
	console.log('User connected...');

	socket.on('connect', function(user) {
		io.emit('User ' + user + ' connected');
	});

	socket.on('disconnect', function(user) {
		console.log('User disconnected...');
		io.emit('User ' + user + ' disconnected');
	});

	socket.on('message', function(msg) {

		let time = moment(msg.time).format('MMM Do h:mm a');

		if (moment().isSame(moment(msg.time), 'day')) {
			time = moment(msg.time).format('h:mm a');
		} else if (moment().subtract(1, 'day').isSame(moment(msg.time), 'day')) {
			time = 'Yesterday ' + moment(msg.time).format('h:mm a');
		}

		io.emit('message', msg);
		io.emit('timeStamp', time);
	});
});

io.emit('some event', { for: 'everyone' });

http.listen(3000, function() {
	console.log('Server started!');
	console.log('listening on *:3000');
});

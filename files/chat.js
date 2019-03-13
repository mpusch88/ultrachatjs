var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

var users = {};
var count = 0;

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
	count++;
	console.log('User' + count + ' connected...');
	io.emit('join', 'User joined...');

	socket.on('disconnect', function() {
		var dc = 'User disconnected...';
		io.emit('dc', dc);
	});

	socket.on('message', function(msg) {

		let time = moment(msg.time).format('h:mm a');
		msg = time + ' | ' + msg;

		io.emit('message', msg);
	});
});

io.emit('some event', { for: 'everyone' });

http.listen(3000, function() {
	console.log('Server started!');
	console.log('listening on *:3000');
});

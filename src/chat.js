var moment = require('moment');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// app.use(express.static('public'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.get('/styles.css', function(req, res) {
	res.sendFile(__dirname + '/styles.css');
});

io.on('connection', function(socket) {
	console.log('User connected...');

	socket.on('disconnect', function() {
		console.log('User disconnected...');
	});

	socket.on('chat message', function(msg) {
		var time = moment(msg.time).format('dddd, MMMM Do, YYYY h:mm:ss A');
		io.emit('chat message', msg);
		io.emit('timeStamp', time);
	});
});

io.emit('some event', { for: 'everyone' });

http.listen(3000, function() {
	console.log('Server started!');
	console.log('listening on *:3000');
});

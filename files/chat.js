var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

var sockets = [];
var users = [];
var userNum = 0;

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
	userNum++;
	console.log(userNum);

	let name = ('User' + userNum);
	io.emit('join', name);

	sockets.push(socket);
	sockets[sockets.indexOf(socket)].name = 'User' + userNum;

	users.push(sockets[sockets.indexOf(socket)].name);
	io.emit('updateUsers', users);

	socket.on('disconnect', function() {

		io.emit('dc', sockets[sockets.indexOf(socket)].name + ' disconnected.');

		sockets.splice(sockets.indexOf(socket), 1);
		users = [];
		
		for(let i = 0; i < sockets.length; i++){
			users[i] = sockets[i].name;
		}

		io.emit('updateUsers', users);
	});

	socket.on('message', function(msg) {
		let time = moment(msg.time).format('h:mm a');
		let userName = sockets[sockets.indexOf(socket)].name;

		io.emit('message', msg, time, userName);
	});

	socket.on('nickname', function(newName) {
		io.emit('join', newName);
		sockets[sockets.indexOf(socket)].name = newName;

		for (let i = 0; i < sockets.length; i++) {
			users[i] = sockets[i].name;
		}

		io.emit('updateUsers', users);
	});
});

http.listen(3000, function() {
	console.log('Server started!');
	console.log('listening on *:3000');
});

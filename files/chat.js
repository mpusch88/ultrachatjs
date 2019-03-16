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
	io.emit('join', ('User' + userNum + ' joined...'));

	sockets.push(socket);
	sockets[sockets.indexOf(socket)].name = 'User' + userNum;

	users.push(sockets[sockets.indexOf(socket)].name);
	io.emit('updateUsers', users);

	// socket.on('disconnect', function() {
	// 	if (users[users.indexOf(socket)].n == null) {      //console.log('Guest disconnect!');
	// } else {
	// 		io.emit('info', "User " + users[users.indexOf(socket)].n + " disconnected.");
	// 	}
	// 	users.splice(users.indexOf(socket), 1);
	// 	io.emit('users list', getUsersList());
	// });

	socket.on('disconnect', function() {
		var dc = 'User disconnected...';
		io.emit('dc', dc);
	});

	socket.on('message', function(msg) {

		// let userName = ....

		let time = moment(msg.time).format('h:mm a');

		io.emit('message', msg, time); // username
	});

	// socket.on('nickname', function(name) {
	//	let msg = 
	// 	io.emit('join', "New user: " + name);
	// 	users[users.indexOf(socket)].n = name;
	// 	io.emit('users list', getUsersList());
	// });

});

http.listen(3000, function() {
	console.log('Server started!');
	console.log('listening on *:3000');
});

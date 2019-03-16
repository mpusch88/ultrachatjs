var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

var users = [];
var userNum = 1;

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

	socket.on('disconnect', function() {
		var dc = 'User disconnected...';
		io.emit('dc', dc);
	});

	socket.on('message', function(msg) {

		// let userName = ....

		let time = moment(msg.time).format('h:mm a');

		io.emit('message', msg, time); // username
	});

	// socket.on('start', function(){
	// 	socket.emit('nick', "guest"+incr);
	// 	clients[clients.indexOf(socket)].n = "guest"+incr;
	// 	incr++;
	// 	io.emit('users list', getUsersList());
	//   });

	// socket.on('set nick', function(nick){
	// 	io.emit('info', "New user: " + nick);
	// 	users[users.indexOf(socket)].n = nick;
	// 	io.emit('users list', getUsersList());
	//   });

	//   socket.on('typing', function(){
	// 	io.emit('typing signal', setUserTyping(users.indexOf(socket)));
	//   });

	//   socket.on('not typing', function(){
	// 	io.emit('typing signal', getUsersList());
	//   });

	// socket.on('disconnect', function() {
	// 	if (users[users.indexOf(socket)].n == null) {      //console.log('Guest disconnect!');
	// } else {
	// 		io.emit('info', "User " + users[users.indexOf(socket)].n + " disconnected.");
	// 	}
	// 	users.splice(users.indexOf(socket), 1);
	// 	io.emit('users list', getUsersList());
	// });

});

io.emit('some event', { for: 'everyone' });

http.listen(3000, function() {
	console.log('Server started!');
	console.log('listening on *:3000');
});

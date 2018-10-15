// an app created by express
var app = require('express')();
// don't understand this part
// Express initializes app to be a function handler that you can supply to an HTTP server.
var http = require('http').Server(app)

// io listens on the connection event for incoming sockets
var io = require('socket.io')(http);

app.get('/', function(req, res) {
	// res.send('<h1> Hello world</h1>');
	res.sendFile(__dirname + '/index.html');
});

// connection
io.on('connection', function(socket){
	// TODO:  tried socket.emit here doesn't work, figure out diff io.emit vs socket.emit

	// use socket.broadcast.emit for user connect to avoid first entry notice
	// socket.broadcast.emit broadcasts this message to all connected socket but this one
	socket.broadcast.emit('chat message', '-- a new user has connected');

	socket.on('chat message', function(msg){

		const short_socket_id = socket.id.substring(0, 4);

		// io.emit does broadcast to all connected sockets
		io.emit('chat message', msg);

		// // socket.emit only emit the message to this connected sockets
		// socket.emit('response', 'sys reply to user '+ short_socket_id + ' received!')
	});

	// broadcast a message when this socket disconnects
	socket.on('disconnect', () => {
		io.emit('chat message', '-- a user has left');
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});

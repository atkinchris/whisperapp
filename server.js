var express = require("express"),
	app = express(),
	http = require("http").createServer(app),
	io = require('socket.io').listen(http),
	Hashids = require("hashids");
	
var salt = 'hamsters';
var alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

var	hashids = new Hashids(salt,5,alphabet);
	
app.set("port", 8080);

http.listen(app.get("port"), function() {
  console.log("Server up and running.");
});
 
io.sockets.on('connection', function (socket) {
 
	socket.on('join', function (data) {
		join(socket, data.roomid);
	});
 
    socket.on('create', function() {
        create(socket);
    });
	
	socket.on('logout', function(data) {
		logout(data.roomid);
	})
 
});

function join(socket, roomid) {
    if(io.sockets.manager.rooms[roomid] != undefined)
    {
        socket.emit('error', 'Invalid Room');
        return;
    }
	socket.join(roomid);
	socket.emit('ready');
}

function create(socket) {
	var roomid = hashids.encrypt(socket.sessionid);
	socket.join(roomid);
	socket.emit('ready');
}

function logout(socket, roomid) {
	socket.leave(roomid);
}

app.post("/message", function(request, response) {

	var message = request.body.message;

	//If the message is empty or wasn't sent it's a bad request
	if(_.isUndefined(message) || _.isEmpty(message.trim())) {
	return response.json(400, {error: "Message is invalid"});
	}

	var id = request.body.id;
	var roomid = request.body.roomid;

	io.sockets.in(roomid).emit("incomingMessage", {message: message, id: id});

	response.json(200, {message: "Message received"});

});
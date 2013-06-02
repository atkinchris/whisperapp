var express = require('express'),
	app = express(),
	http = require('http').createServer(app),
	io = require('socket.io').listen(http),
	_ = require('underscore');

app.set('port', 80);

app.set("views", __dirname + "/views");

app.set("view engine", "jade");

app.use(express.bodyParser());

app.use(express.static('public', __dirname + '/public'));

io.set('log level', 2);

io.sockets.on('connection', function (socket) {
 	socket.on('subscribe', function(data) { socket.join(data.roomid); })
});

app.post("/message", function(request, response) {
	var message = request.body.message;
	var roomid = request.body.roomid;

	if(_.isUndefined(message) || _.isEmpty(message.trim())) {
	return response.json(400, {error: "Message is invalid"});
	}

	io.sockets.in(roomid).emit("incomingMessage", {message: message});

	response.json(200, {message: "Message received"});
});

app.get('/', function(req, res) {
	var roomid = req.query.id;
	if (roomid != null) {
		res.render('chat', {pagetitle: 'Whisper Chat | Room ', roomid: roomid})
	};
	res.render('index')
});

http.listen(app.get('port'), function() {
	console.log('Server up and running.');
});
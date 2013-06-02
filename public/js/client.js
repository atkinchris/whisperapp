function init() {
	var serverBaseUrl = document.domain;

	var socket = io.connect(serverBaseUrl);

	var sessionId = '';

	socket.on('connect', function() {
		sessionId = socket.socket.sessionid;
		console.log('Connected ' + sessionId);
		socket.emit('subscribe', {roomid: roomid});
	});

	socket.on('incomingMessage', function(data) {
	    var message = data.message;
		var d = new Date();
		var timestamp = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ':' + ('0' + d.getSeconds()).slice(-2);
		var id = data.id;
	    $('#messages').append('<span class=' + (id === sessionId ? 'you' : '') + '><br /><b>&#91;' + timestamp + '&#93;</b> ' + message);
	});

	function sendMessage() {
		var message = $('#message').val();
		$.ajax({
			url:  '/message',
			type: 'POST',
			dataType: 'json',
			data: {message: message, id: sessionId, roomid: roomid}
		});
	}

	$('#send').on('click', sendMessage);
}

$(document).on('ready', init);
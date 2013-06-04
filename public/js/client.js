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
	    $('#messages').append('<li class=' + (id === sessionId ? 'you' : '') + '><b>&#91;' + timestamp + '&#93;</b> ' + message + '</li>');
	});

	function sendMessage() {
		var message = $('#message').val();
		$.ajax({
			url:  '/message',
			type: 'POST',
			dataType: 'json',
			data: {message: message, id: sessionId, roomid: roomid}
		});
		$('#message').val('');
	}

	function outgoingMessageKeyDown(event) {
		if (event.which == 13) {
			event.preventDefault();
			if ($('#message').val().trim().length <= 0) {
			return;
		}
		sendMessage();
		$('#message').val('');
		}
	}

	function outgoingMessageKeyUp() {
		var outgoingMessageValue = $('#message').val();
		$('#send').attr('disabled', (outgoingMessageValue.trim()).length > 0 ? false : true);
	}

	$('#send').on('click', sendMessage);
	$('#message').on('keydown', outgoingMessageKeyDown);
	$('#message').on('keyup', outgoingMessageKeyUp);
}

$(document).on('ready', init);
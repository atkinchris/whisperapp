function init() {
	var serverBaseUrl = document.domain;

	var socket = io.connect(serverBaseUrl);

	socket.on('connect', function() {
		console.log('Connected');
		socket.emit('subscribe', {roomid: roomid});
	});

	socket.on('incomingMessage', function(data) {
		var message = data.message;
		alert(message);
	});

	function sendMessage() {
		var message = $('#message').val();
		$.ajax({
			url:  '/message',
			type: 'POST',
			dataType: 'json',
			data: {message: message, roomid: roomid}
		});
	}

	$('#send').on('click', sendMessage);
}

$(document).on('ready', init);
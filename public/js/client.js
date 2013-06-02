function init() {

	//var serverBaseUrl = document.domain;
	
	//var socket = io.connect(serverBaseUrl);

	var socket = io.connect('127.0.0.1:8080');

	function sendMessage() {
		var outgoingMessage = $('#outgoingMessage').val();
		$.ajax({
			url:  '/message',
			type: 'POST',
			dataType: 'json',
			data: {message: outgoingMessage, id: sessionId}
		});
		$('#outgoingMessage').val('');
	}
	
	function outgoingMessageKeyDown(event) {
		if (event.which == 13) {
		event.preventDefault();
		if ($('#outgoingMessage').val().trim().length <= 0) {
		return;
		}
		sendMessage();		
		}
	}

	function outgoingMessageKeyUp() {
		var outgoingMessageValue = $('#outgoingMessage').val();
		$('#send').attr('disabled', (outgoingMessageValue.trim()).length > 0 ? false : true);
	}

	function join() {
		var roomid = $('#roomid').val();
		socket.emit('join', roomid);
	}
	
	function create() {
		socket.emit('create');
		alert(socket.id);
	}

	function logout() {
		$('#chat').hide();
		$('#login').show();
		socket.emit('logout', {id: sessionId, roomid: roomid});
	}
	
	socket.on('connect', function () {
		var sessionId = socket.socket.sessionid;
		console.log('Connected ' + sessionId);
	});

	socket.on('ready', function () {
		$('#login').hide();
		$('#chat').show();
	});
		
	socket.on('incomingMessage', function (data) {
		var message = data.message;
		var d = new Date();
		var timestamp = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ':' + ('0' + d.getSeconds()).slice(-2);
		var id = data.id;
		$('#messages').append('<span class=' + (id === sessionId ? 'you' : '') + '><br /><b>&#91;' + timestamp + '&#93;</b> ' + message);
	});
		
	socket.on('error', function (e) {
		alert(e);
	});

	socket.on('roomcreated', function (roomid) {
		alert(roomid);
	});
		
	$('#outgoingMessage').on('keydown', outgoingMessageKeyDown);
	$('#outgoingMessage').on('keyup', outgoingMessageKeyUp);
	$('#send').on('click', sendMessage);
	$('#join').on('click', join);
	$('#create').on('click', create);
	$('#logout').on('click', logout);
}

$(document).on('ready', init);
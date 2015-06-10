///<reference path='../libs/socket.io-client.d.ts' />
///<reference path='../libs/jquery.d.ts' />

var namespace;

$(document).ready(function(){
	var socket = io(namespace);
	$('form').submit(function(){
		socket.emit('chat message', $('#m').val());
		$('#m').val('');
		return false;
	});
	socket.on('chat message', function(msg){
		$('#messages').append($('<li>').text(msg));
	});
});
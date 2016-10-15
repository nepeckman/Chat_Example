///<reference path='../libs/socket.io-client.d.ts' />
///<reference path='../libs/jquery.d.ts' />


$(document).ready(function(){

	var socket = io();
	
	// Receives roomlist upon connection
	socket.on('roomlist', function(roomlist){
		for (var idx = 0; idx < roomlist.length; idx++){
			$('#rooms').append($('<li class="room">').text(roomlist[idx]));
		}
	});	
	
	// Moves user to chatroom upon room selection
	$('form').submit(function(){
	location.href = "http://localhost:8080/chat/" + $("#n").val();
		event.preventDefault();
	});
	
	// Sets the room list objects to bring user to room upon click
	$('#rooms').on('click', 'li', function(){
		var $li = $(this);
		console.log($li.text());
		var index = $li.text().indexOf(":");
		location.href = "http://nodejs-basicchat.rhcloud.com/chat/" + $li.text().substring(0, index);
	});
	
});

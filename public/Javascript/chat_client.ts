///<reference path='../libs/socket.io-client.d.ts' />
///<reference path='../libs/jquery.d.ts' />			
			
// Set initial values	
var namespace = window.location.pathname;
var username = null;

// Begin socket and jquery event setup
$(document).ready(function(){

	var socket = io(namespace);
	
	/* Username submission event
	 * Checks the new username against all existing usernames.
	 * If it is free, it emits a 'new name' event with the new and old names.
	 * The old name will be used to determine the public message.
	*/
	$('#username').submit(function(){
		var free = true;
		$('li.user').each(function(index){
			if ($(this).text().toLowerCase() === $('#u').val().toLowerCase()){
				$('#messages').append($('<li>').text("That name is taken!"));
				free = false;
			}
		});
		if (free){
			socket.emit('new name', $('#u').val(), username);
			username = $('#u').val();
			$('#welcome').text("Welcome, " + username);
		}
		return false;
	});
	
	/* Chat message submission event.
	 * Checks to ensure the user is logged in.
	 * Emits a 'chat message' event with the message.
	*/
	$('#chat').submit(function(){
		if (username != undefined){
			socket.emit('chat message', username + ": " + $('#m').val());
		} else {
			$('#messages').append($('<li>').text("Please choose a username!"));
		}
		$('#m').val('');
		return false;
	});
	
	/* Receives a message and posts it to users message box.
	 * Event sent when others submit a message.
	*/
	socket.on('chat message', function(msg){
		$('#messages').append($('<li>').text(msg));
	});
	
	/* Receives list of users and sorts them in the users box.
	 * Event sent on initial connection to receive a room list.
	*/
	socket.on('usernames', function(names){
		for (var idx = 0; idx < names.length; idx++){
			if(names[idx] != null){
				$('#users').append($('<li class="user">').text(names[idx]));
			}
		}
		var $users = $('#users');
		var $usersli = $users.children();
		// Sort, not case sensitive, by name
		$usersli.sort(function(a, b){
			var atext = $(a).text().toLowerCase();
			var btext = $(b).text().toLowerCase();
			if (atext> btext){ return 1;}
			else if (atext< btext){return -1;}
			else {return 0;}
		});
		// Re-inject object
		$usersli.detach().appendTo($users);
	});
	
	/* Receives a new username.
	 * If the user was previously not "online", it posts a join message.
	 * If the user was previously "online", it posts a name change message.
	 * Event sent upon name change.
	*/
	socket.on('new name', function(name, oldname){
		if(oldname === null){
			$('#messages').append($('<li>').text(name + " has joined the room"));
		} else {
			$('#messages').append($('<li>').text(oldname + " is now called " + name));
		}
		$('li.user').each(function(index){
			if ($(this).text() === oldname){
				$(this).remove();
			}
		});
		$('#users').append($('<li class="user">').text(name));
		var $users = $('#users');
		var $usersli = $users.children();
		$usersli.sort(function(a, b){
			var atext = $(a).text().toLowerCase();
			var btext = $(b).text().toLowerCase();
			if (atext> btext){ return 1;}
			else if (atext< btext){return -1;}
			else {return 0;}
		});
		$usersli.detach().appendTo($users);
	});
	
	/* Posts a disconnect message and removes name from the list.
	 * Checks to make sure the user was "online."
	 * Event sent upon another users disconnection.
	*/
	socket.on('userGone', function(name){
		if(name != null){
			$('#messages').append($('<li>').text(name + " left the room"));
			$('li.user').each(function(index){
				if ($(this).text() === name){
					$(this).remove();
				}
			});
		}
	});
	
});
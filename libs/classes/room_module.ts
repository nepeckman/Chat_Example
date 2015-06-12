///<reference path='../socket.io.d.ts' />


export class User{

	/*Abstraction encapsulates a username and a socket.
	  It is constructed with just a socket, as the username starts as null.
	  The username is set after the user connects.
	*/
	
	name: string;
	socket: SocketIO.Socket
	
	constructor(socket: SocketIO.Socket){
		this.socket = socket;
	}
	
	setName(name: string){
		this.name = name;
	}
	
	getName(): string {
		return this.name;
	}
	
	getSocket(): SocketIO.Socket{
		return this.socket;
	}
}

export class Room {

	/*Abstraction encapsulates a SocketIO namespace and an array of users.
	  A roomManager listens to hear when the number of users is 0.
	  It is constructed using a namespace and the roomManager.
	  The namespace events are set in the constructor.
	  It creates and alters user objects, as well as emits messages
	  produced by connecting sockets.
	*/
	
	namespace: SocketIO.Namespace;
	users: User[];
	manager: roomManager;
	
	constructor(namespace: SocketIO.Namespace, manager: roomManager) {
		this.users = new Array();
		this.manager = manager;
		var room = this;
		namespace.on('connection', function(socket) {
			room.addUser(new User(socket));
			socket.emit('usernames', room.getUsernames());
  			socket.on('disconnect', function(){
  				var user = room.findUser(socket);
  				namespace.emit('userGone', user.getName());
  				room.removeUser(user);
  			});
			socket.on('chat message', function(msg){
    			namespace.emit('chat message', msg);
  			});
  			socket.on('new name', function(username, oldname){
  				room.nameChange(room.findUser(socket), username);
  				namespace.emit('new name', username, oldname);
  			});
  		});	
  		this.namespace = namespace;
	}
	
	getRoomName(): string{
		// Offset is to remove /chat/
		return this.namespace.name.substring(6, this.namespace.name.length);
	}
	
	getNamespace(): SocketIO.Namespace{
		return this.namespace;
	}
	
	getNumberOfUsers(): number{
		return this.users.length;
	}
	
	getNumberOfJoinedUsers(): number{
		// Returns users who have 'joined' the chat by selecting a username
		var joinedUsers = 0;
		for(var idx = 0; idx < this.users.length; idx++){
			if (this.users[idx].getName() != null){
				joinedUsers++;
			}
		}
		return joinedUsers;
	}
	
	getUsernames(): string[]{
		var output = new Array();
		for (var idx = 0; idx < this.users.length; idx++){
			output.push(this.users[idx].getName())
		}
		return output;
	}
	
	addUser(user: User){
		this.users.push(user);
	}
	
	removeUser(user: User){
		var index: number = this.users.indexOf(user);
		if (index > -1){
			this.users.splice(index, 1);
		}
		
		if (this.users.length < 1){
			this.manager.removeRoom(this);
		}
	}
	
	nameChange(user: User, username: string){
		user.setName(username);
	}
	
	findUser(socket: SocketIO.Socket): User {
		for (var idx = 0; idx < this.users.length; idx++){
			if (this.users[idx].socket.id === socket.id){
				return this.users[idx];
			}
		}
	}
}

export class roomManager{

	/*Abstraction represents a collection of rooms.
	  It holds the rooms and allows access to their information.
	  It checks for the existence of rooms.
	  It listens and removes a room when users reaches 0.
	  A server is encapsulated to allow deletion of namespaces.
	*/
	
	rooms: Room[];
	server: SocketIO.Server;
	
	constructor(server: SocketIO.Server){
		this.rooms = new Array();
		this.server = server;
	}
	
	addRoom(room: Room){
		this.rooms.push(room);
	}
	
	removeRoom(room: Room){
		delete this.server.nsps[room.getNamespace().name];
		var index: number = this.rooms.indexOf(room);
		if (index > -1){
			this.rooms.splice(index, 1);
		}
	}
	
	getRoom(name: string): Room{
		for (var room in this.rooms){
			if (room.getRoomName() === name){
				return room;
			}
		}
	}
	
	roomCheck(namespace: SocketIO.Namespace): boolean{
		for(var idx = 0; idx < this.rooms.length; idx++){
			if (this.rooms[idx].getNamespace() === namespace){
				return false;
			}
		}
		return true;
	}
	
	getRoomList(): string[]{
		this.rooms.sort(function(a, b){ 
			return b.getNumberOfUsers() - a.getNumberOfUsers();
		});
		var output = new Array();
		for(var idx = 0; idx < this.rooms.length; idx++){
			if(this.rooms[idx].getNumberOfJoinedUsers() > 0){
				output.push(this.rooms[idx].getRoomName() + ": " 
				+ this.rooms[idx].getNumberOfJoinedUsers() + " users online");
			}
		}
		return output;
	}
}
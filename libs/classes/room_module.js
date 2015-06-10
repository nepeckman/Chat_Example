///<reference path='../socket.io.d.ts' />
var User = (function () {
    function User(socket) {
        this.socket = socket;
    }
    User.prototype.setName = function (name) {
        this.name = name;
    };
    User.prototype.getName = function () {
        return this.name;
    };
    User.prototype.getSocket = function () {
        return this.socket;
    };
    return User;
})();
exports.User = User;
var Room = (function () {
    function Room(namespace, manager) {
        this.users = new Array();
        this.manager = manager;
        var room = this;
        namespace.on('connection', function (socket) {
            room.addUser(new User(socket));
            socket.emit('usernames', room.getUsernames());
            socket.on('disconnect', function () {
                var user = room.findUser(socket);
                namespace.emit('userGone', user.getName());
                room.removeUser(user);
            });
            socket.on('chat message', function (msg) {
                namespace.emit('chat message', msg);
            });
            socket.on('username', function (username, oldname) {
                room.nameChange(room.findUser(socket), username);
                namespace.emit('username', username, oldname);
            });
        });
        this.namespace = namespace;
    }
    Room.prototype.getRoomName = function () {
        return this.namespace.name.substring(6, this.namespace.name.length);
    };
    Room.prototype.getNamespace = function () {
        return this.namespace;
    };
    Room.prototype.getNumberOfUsers = function () {
        return this.users.length;
    };
    Room.prototype.getUsernames = function () {
        var output = new Array();
        for (var idx = 0; idx < this.users.length; idx++) {
            output.push(this.users[idx].getName());
        }
        return output;
    };
    Room.prototype.addUser = function (user) {
        this.users.push(user);
    };
    Room.prototype.removeUser = function (user) {
        var index = this.users.indexOf(user);
        if (index > -1) {
            this.users.splice(index, 1);
        }
        /*
        if (this.users.length < 1){
            this.namespace = null;
            this.manager.removeRoom(this);
        }
        */
    };
    Room.prototype.nameChange = function (user, username) {
        user.setName(username);
    };
    Room.prototype.findUser = function (socket) {
        for (var idx = 0; idx < this.users.length; idx++) {
            if (this.users[idx].socket.id === socket.id) {
                return this.users[idx];
            }
        }
    };
    return Room;
})();
exports.Room = Room;
var roomManager = (function () {
    function roomManager() {
        this.rooms = new Array();
    }
    roomManager.prototype.addRoom = function (room) {
        this.rooms.push(room);
    };
    roomManager.prototype.removeRoom = function (room) {
        var index = this.rooms.indexOf(room);
        if (index > -1) {
            this.rooms.splice(index, 1);
        }
    };
    roomManager.prototype.getRoom = function (name) {
        for (var room in this.rooms) {
            if (room.getRoomName() === name) {
                return room;
            }
        }
    };
    roomManager.prototype.roomCheck = function (namespace) {
        for (var idx = 0; idx < this.rooms.length; idx++) {
            if (this.rooms[idx].getNamespace() === namespace) {
                return false;
            }
        }
        return true;
    };
    roomManager.prototype.getRoomList = function () {
        this.rooms.sort(function (a, b) {
            return b.getNumberOfUsers() - a.getNumberOfUsers();
        });
        var output = new Array();
        for (var idx = 0; idx < this.rooms.length; idx++) {
            if (this.rooms[idx].getNumberOfUsers() > 0) {
                output.push(this.rooms[idx].getRoomName() + ": "
                    + this.rooms[idx].getNumberOfUsers() + " users online");
            }
        }
        return output;
    };
    return roomManager;
})();
exports.roomManager = roomManager;

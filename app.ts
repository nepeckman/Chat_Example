///<reference path='libs/express.d.ts' />
///<reference path='libs/socket.io.d.ts' />



var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.set('views', __dirname +'/views');
app.set('view engine', 'jade');


app.get('/', function (req, res){
	res.render('chat_room1', {pageTitle: "Chat Room"})
});

server.listen(3000, function(){
	console.log("Listening at port 3000");
});

server.on('connection', function(socket){
	console.log('A user connected');
	socket.on('chat message', function(msg){
		console.log('message: ' + msg);
	});
});



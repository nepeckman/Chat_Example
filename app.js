///<reference path='libs/express.d.ts' />
///<reference path='libs/socket.io.d.ts' />
var routes = require("./routes/index");
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(3000, function () {
    console.log("Listening at port 3000");
});
server.on('connection', function () {
    console.log('A user connected');
});
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.get('/', routes.index, function (req, res) { });
exports.App = app;

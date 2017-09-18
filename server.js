var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var enableCORS = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-   Length, X-Requested-With');
	if ('OPTIONS' == req.method) {
  	res.send(200);
	}else {
  	next();
	}
};

app.use(enableCORS);

app.use(express.static( __dirname + '/' ));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	console.log('socket connected bla bla bla');
  socket.on('theatre', function(newValue,action){
		socket.broadcast.emit('theatre_'+action, newValue);
  });
  
  socket.on('case', function(newValue,action){
		console.log('case'+action);
		//io.emit('case_'+action, newValue);
		socket.broadcast.emit('case_'+action, newValue);
  });
  socket.on('role', function(newValue,action){
		console.log('role'+action);
		socket.broadcast.emit('role_'+action, newValue);
  });
  socket.on('team', function(newValue,action){
		console.log('team_'+action);
		socket.broadcast.emit('team_'+action, newValue);
  });
  socket.on('position', function(data,action){
		socket.broadcast.emit('position_'+action, data);
  });

});
  
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

http.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

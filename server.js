var express = require('express');
var cors = require('cors');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(cors());
app.options('/', cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});



/*
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
*/


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
  
//var port=process.env.OPENSHIFT_NODEJS_PORT || 3000;
//var ipaddress=process.env.OPENSHIFT_NODEJS_IP;

var ip =  '0.0.0.0';
//var port = 8080;

//app.listen(80, function () {
//  console.log('CORS-enabled web server listening on port 80')
//})

var isUseHTTPs  = true;
var port = 443; // or 9001


http.listen(port);

//http.listen(port, function () {
//  console.log('CORS-enabled web server listening on port '+port)
//})
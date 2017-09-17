var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


var cors = require('cors');
app.use(cors());

app.get('/products/:id', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})



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
  
//var port=process.env.OPENSHIFT_NODEJS_PORT || 3000;
//var ipaddress=process.env.OPENSHIFT_NODEJS_IP;

var ip =  '0.0.0.0';
var port = 8080;

//app.listen(80, function () {
//  console.log('CORS-enabled web server listening on port 80')
//})

http.listen(port,ip, function() {
  console.log('Node app is running on port', port);
});

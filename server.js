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
	console.log('socket connected');
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
	var gcm = require('node-gcm');


  socket.on('push', function(data){
  	
  	
	var message = new gcm.Message({
    "soundname": "default",
    "style": "inbox",
    "summaryText": "There are %n% notifications",
    "ledColor": [0, 0, 255, 0],
    "vibrationPattern": [2000, 1000, 500, 500],
    "priority": 2,
    "content-available": "1"
    //"delayWhileIdle": true
	});
	var sender = new gcm.Sender('AIzaSyC1cYdTVqsvzby2QP0SNrpNJx_mbx7rCHs');
  	
  	
  	console.log('push received');
  	message.addData('notId',data.notId);	
		message.addData('message',data.message);	
		message.addData('title',data.title );
		message.addData('style','inbox');
		message.addData('summaryText','There are %n% notifications');
		message.addData('priority',2);
		message.addData('content-available','1');
		message.addData('vibrationPattern',[2000, 1000, 500, 500]);
		message.timeToLive = 3000;// Duration in seconds to hold in GCM and retry before timing out. Default 4 weeks (2,419,200 seconds) if not specified.
		var registrationIds=data.regids;
		var teamId=data.teamId;
		
		sender.send(message, { registrationTokens: registrationIds }, 4, function (err, response) {
  		if(err) {
  			console.error('error:',err);
  		}	else {
  			console.log(response);
  			socket.broadcast.emit('push_callback', teamId);
  			
  		}
		});
  });
});
  
//var port=process.env.OPENSHIFT_NODEJS_PORT || 3000;
var ipaddress=process.env.OPENSHIFT_NODEJS_IP;

//var ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;

http.listen(port,ipaddress, function() {
  console.log('Node app is running on port', port);
});

var express = require('express');
var cors = require('cors');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(cors());

app.get('/', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})

var whitelist = ['http://localhost:1841', 'http://localhost', 'http://juhono.com']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}


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


http.listen(8080, function () {
  console.log('CORS-enabled web server listening on port 8080')
})
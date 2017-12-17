//WEB SERVER REQUIRES
var express = require('express');
var path = require('path');

//WEB SERVER DEFINITIONS
var app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use("/styles",express.static(__dirname + "/views/styles"));
app.use("/images",express.static(__dirname + "/views/images"));

//LOGGER
var logger = require('morgan');
app.use(logger('dev'));

//ROUTES DEFINITION
var index = require('./routes/index');
var login = require('./routes/login');

//ROUTES INCLUSION
app.use('/', index);
app.use('/login', login);

//STARTING THE SERVER
var port = '80';
app.listen(port);
console.log('The web server is working on the port: ' + port);

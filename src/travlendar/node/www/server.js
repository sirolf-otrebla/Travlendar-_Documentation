//WEB SERVER REQUIRES
var express = require('express');
var path = require('path');

//WEB SERVER DEFINITIONS
var app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

//ROUTES DEFINITION
var index = require('./routes/index');
var login = require('./routes/login');

//ROUTES INCLUSION
app.use('/', index);
app.use('/login.ejs', login);

//STARTING THE SERVER
var port = '80';
app.listen(port);
console.log('The web server is working on the port: ' + port);

//WEB SERVER REQUIRES
var express = require('express');
var path = require('path');

//WEB SERVER DEFINITIONS
var app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

//ROUTES DEFINITION
app.get('/', function(req, res) {
    res.render('index');
});

//STARTING THE SERVER
var port = '80';
app.listen(port);
console.log('The web server is working on the port: ' + port);

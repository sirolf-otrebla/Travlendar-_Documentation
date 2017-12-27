//WEB SERVER REQUIRES
let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');

//WEB SERVER DEFINITIONS
var app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use("/styles",express.static(__dirname + "/views/styles"));
app.use("/images",express.static(__dirname + "/views/images"));

//BODY PARSER USAGE
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//LOGGER
var logger = require('morgan');
app.use(logger('dev'));

//ROUTES DEFINITION
var index = require('./routes/index');

//ROUTES INCLUSION
app.use('/', index);

//STARTING THE SERVER
var port = '80';
app.listen(port);
console.log('The web server is working on the port: ' + port);

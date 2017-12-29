//WEB SERVER REQUIRES
let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');
let session = require('express-session');

//WEB SERVER DEFINITIONS
var app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use("/styles",express.static(__dirname + "/views/styles"));
app.use("/images",express.static(__dirname + "/views/images"));
app.use("/js",express.static(__dirname + "/views/js"));

//BODY PARSER USAGE
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//SESSION COOKIE DEFINITION

app.use(session(
    {
        secret: 'jifjapok93i41ko@°é+sùa§*)"=!=DBSYBida adòlap11||',
        resave: true,
        saveUninitialized: true,
        cookie: { maxAge: 1 * 60 * 1000 },                  //FORMAT: MM * SS * MS
    }));

//LOGGER
var logger = require('morgan');
app.use(logger('dev'));

//ROUTES DEFINITION
var index = require('./routes/index');
let user = require('./routes/user');

//ROUTES INCLUSION
app.use('/', index);
app.use('/user', user);

//STARTING THE SERVER
var port = '80';
app.listen(port);
console.log('The web server is working on the port: ' + port);

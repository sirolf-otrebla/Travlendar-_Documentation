var net = require('net');
var fs = require('fs');

var servers = JSON.parse(fs.readFileSync('./travlendar/node/www/dispatcher/file.json')).servers;

var dispatcher = new net.Socket();

dispatcher.connect(servers[0].port, servers[0].address, function() {
    console.log('connected');
    dispatcher.write('something');
});

dispatcher.on('data', function(data) {
    console.log(data.toString());
});
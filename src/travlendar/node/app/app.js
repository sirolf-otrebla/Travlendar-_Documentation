//APPLICATION SERVER REQUIRES
var net = require('net');

//APPLICATION SERVER DEFINITIONS
var server = net.createServer(function(socket) {
    socket.write('Welcome to the application server');
    socket.on('data', function(data) {
        console.log(data.toString());
    })
});

server.listen(8081);
console.log('Application Server is listening on 8081 port');

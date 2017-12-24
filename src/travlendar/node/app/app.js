//APPLICATION SERVER REQUIRES
let net = require('net');
let presenter = require('./presenter/presenter');
let handleFunctions = require('./presenter/handleFunctions');

//APPLICATION SERVER DEFINITIONS
let server = net.createServer(function(socket) {
    socket.write(JSON.stringify('Welcome to the application server'));
    socket.on('data', function(data) {
        presenter.start(data, socket, [handleFunctions.handleLogin], handleFunctions.handleError);
    });
});

server.listen(8081);
console.log('Application Server is listening on 8081 port');
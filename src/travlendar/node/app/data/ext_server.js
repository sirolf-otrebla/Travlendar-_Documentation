const EXT_FETCHER_PORT = 12345;
const EXT_FETCHER_IP = 'localhost';

let net = require('net');

let server = net.createServer( (socket) => {
    console.log("data access manager connected");
    
    socket.on('end', function () {
        console.log("data access manager disconnected");
    });
    
    socket.on('data', function (data) {
        let ext = require('./external.js');
        let obj = JSON.parse(data);
        try{
            obj.fetch(ext.fetchRoute);
            socket.write(JSON.stringify(obj));
        } catch (err){
            //TODO
        }
    })
});

server.listen(EXT_FETCHER_PORT, EXT_FETCHER_IP);
console.log("[EXT] server online");


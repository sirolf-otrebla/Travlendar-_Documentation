const EXT_FETCHER_PORT = 12586;
const EXT_FETCHER_IP = 'localhost';

let net = require('net');

let server = net.createServer( (socket) => {
    console.log("data access manager connected");
    
    socket.on('end', function () {
        console.log("data access manager disconnected");
    });
    
    socket.on('data', function (data) {
        let obj = JSON.parse(data);
        try{
            let path = "./callbacks/" + obj.mod;
            let mod = require(path);
            mod.fetch(obj, (msg) => {
                socket.write(JSON.stringify(msg));
            });
        } catch (err){
            //TODO
        }
    })
});

server.listen(EXT_FETCHER_PORT, EXT_FETCHER_IP);
console.log("[EXT] server online");


const DB_FETCHER_PORT = 12346;
const DB_FETCHER_IP = 'localhost';

let mysql = require('mysql');

let dbClient = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "travlendarAdmin",
    password: "",
    database: "travlendardb"
});

let net = require('net');

let server = net.createServer( (socket) => {

    console.log("data access manager connected");

    /*socket.on('end', function () {
        console.log("data access manager disconnected");
    });
*/
    socket.on('data', function (data) {
            let obj = JSON.parse(data);
            let path = "./callbacks/" + obj.mod;
            let mod = require(path);
            mod.fetch(obj, dbClient, function (msg) {
                socket.write(JSON.stringify(msg));
            });
        });
});

server.listen(DB_FETCHER_PORT);
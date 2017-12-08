/*
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
 */


DBConn = {
    __self : this,
    __socket : null,


    Connection : function (ID) {
        let net = require('net');
        let fs = require('fs');
        let serverList = JSON.parse(fs.readFileSync('./travlendar/node/app/data_acc/serverList.json')).servers;
        let connectingTo = serverList[ID];
        __socket = new net.socket();
        __connect(connectingTo);
    },

    write : function (msg) {
        __socket.write(msg);
    },

    __connect : function (connectingTO) {
        this.__socket.connect(connectingTO.port, connectingTO.address, function () {
            console.log("CONNECTED TO : " + connectingTO.port + ":" + connectingTO.address);
        })
    }

}
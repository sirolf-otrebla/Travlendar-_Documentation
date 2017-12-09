//DISPATCHER DEFINITIONS
var net = require('net');
var fs = require('fs');

//PARSE THE SERVERS FILE, THAT CONTAINS INDICATIONS FOR EACH SERVER
const servers = JSON.parse(fs.readFileSync('./travlendar/node/www/dispatcher/file.json')).servers;

class Server {

    constructor(ID, address, port) {
        this.__serverID = ID;
        this.__address = address;
        this.__port = port;
        this.__isConnected = false;
        this.__socket = new net.Socket();
        this.__usersConnected = new Array();
    }

    connect() {
        this.__socket.connect(this.__port, this.__address, function(err) {
            this.__isConnected = true;
            if(err)
                this.__isConnected = false;
            console.log('Dispatcher is now connected with server on address: \'' + this.__address +
                '\' and port: \'' + this.__port + '\'');
        });

        this.__socket.on('data', this.receiveData(data));

        this.__socket.on('close', function() {
            this.__isConnected = false;
        })
    }

    disconnect() {
        if(!this.__isConnected) {
            this.__socket.destroy();
            this.__isConnected = false;
        }
    }

    sendData(email, data) {
        if(this.checkUser(email) && this.__isConnected) {
            this.__socket.write(data);
        }
    }

    receiveData(data) {
        let json = JSON.parse(data);

        if(this.checkUser(json.email))
            this.removeUser(json.email);

        return json;
    }

    getServerID() {
        return this.__serverID;
    }

    getServerLoad() {
        return this.__usersConnected.length;
    }

    addUser(email, receiveFunction) {
        if(!this.checkUser(email)) {
            this.__usersConnected.push(email);
            this.__functionToDoOnReceive = receiveFunction;
        }
    }

    checkUser(email) {
        return this.__usersConnected.find(email);
    }

    removeUser(email) {
        if(this.checkUser(email)) {
            this.__usersConnected.splice(this.__usersConnected.indexOf(email), 1);
        }
    }
}



module.exports = class Dispatcher {

    constructor() {
        this.__availableServers = new Array();

        for (let i = 0; i < servers.length; i++) {
            this.__availableServers.push(new Server(servers[i].name, servers[i].address, servers[i].port));
        }
    }

    connectToAppServer() {
        for(let i = 0; i < this.__availableServers.length; i++) {
            this.__availableServers[i].connect();
        }
    }

    disconnectFromAppServer() {
        for(let i = 0; i < this.__availableServers.length; i++) {
            this.__availableServers[i].disconnect();
        }
    }

    sendMessage(email, data, receiveFunction) {
        let find = false;
        let bestServer = this.__availableServers[0];
        for(let i = 0; (i < this.__availableServers.length) && (!find); i++) {
            if(this.__availableServers[i].checkUser(email)) {
                this.__availableServers[i].sendData(email, data);
                find = true;
            }
        }

        if(!find) {
            for(let i = 1; i < this.__availableServers.length; i++) {
                if(bestServer.getServerLoad() > this.__availableServers[i].getServerLoad())
                    bestServer = this.__availableServers[i];
            }
        }

        bestServer.addUser(email, receiveFunction);
        bestServer.sendData(email, data);
    }

}
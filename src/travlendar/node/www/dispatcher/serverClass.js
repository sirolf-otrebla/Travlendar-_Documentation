//CLASS USED TO REPRESENT ONE SINGLE SERVER

//NET DEFINITIONS
let net = require('net');

class ServerClass {

    //CONSTRUCTOR, ONLY CREATES A SOCKET AND A MAP FOR THE USERS
    constructor(ID, address, port) {
        this.__serverID = ID;
        this.__address = address;
        this.__port = port;
        this.__usersConnected = new Map();
        this.__socket = new net.Socket();
    }

    //CONNECT TO THE APPLICATION SERVER
    connect() {
        let self = this;
        this.__socket.connect(this.__port, this.__address, function() {
            console.log('Now Server is available on port: ' + self.__port + ' @ ' + self.__address);
        });

        //ON DATA FUNCTION, CALLED WHEN THE APPLICATION SERVER RETRIES A MESSAGE
        this.__socket.on('data', function(data) {
            let json = JSON.parse(data);
            if(self.__usersConnected.has(json.email)) {
                self.__usersConnected.get(json.email)();
                self.__usersConnected.delete(json.email);
            }
        });
    }

    getLoad() {
        this.__usersConnected.size;
    }

    //METHOD USED TO SEND MESSAGE TO THE APPLICATION SERVER
    sendMessage(email, data, callback) {
        if(!this.__usersConnected.has(email)) {
            this.__usersConnected.set(email, callback);
            this.__socket.write(data);
        }
    }

}

module.exports = ServerClass;
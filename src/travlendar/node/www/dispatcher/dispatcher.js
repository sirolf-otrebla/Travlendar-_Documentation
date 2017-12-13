let server = require('./serverClass');
let fs = require('fs');

const __availableServer = JSON.parse(fs.readFileSync('./travlendar/node/www/dispatcher/Application_Server_Config.json')).servers;

class Dispatcher {

    constructor() {

        this.__serverArray = new Array();

        for(let i = 0; i < __availableServer.length; i++) {
            let newServer = new server(__availableServer[i].id, __availableServer[i].address, __availableServer[i].port);

            try{
                newServer.connect();
            } catch (e) {
                console.log('Error while server: ' + __availableServer.id + ' is connecting');
            }

            this.__serverArray.push(newServer);
        }
    }

    sendMessage(email, data, callback) {
        let bestServer = this.__serverArray[0];
        let messageSent = false;

        for(let i = 1; i < __availableServer.length && !messageSent; i++) {

            if(this.__serverArray[i].getLoad() < bestServer.getLoad()) {
                bestServer = this.__serverArray[i];
            }

        }

        bestServer.sendMessage(email, data, callback);
    }
}

let __singleton = new Dispatcher();

module.exports = __singleton;
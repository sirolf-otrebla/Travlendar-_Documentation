
var error_handler = require('../error_handler');

function DataConn(ID){
    var __self  = this;
    let net = require('net');
    let fs = require('fs');
    let serverList = JSON.parse(fs.readFileSync('./travlendar/node/app/data_acc/serverList.json')).servers;

    this.__connectingTO = serverList[ID];
    this.__socket = new net.__socket();
    
    this.connect = function () {
        this.__socket.connect(this.__connectingTO.port, this.__connectingTO.__address, function () {
            console.log("CONNECTED TO : " + __self.__connectingTO.port + ":" + __self.__connectingTO.__address);
        });
    };

    this.write = function (msg) {
        this.__socket.write(msg);
    };

}


exports.manager = function DataAccess(){

    const MY_DATA_SERVER_ID = 0;
    const MY_EXT_SERVER_ID = 1;
    
    this.__DBConn = new DataConn(MY_DATA_SERVER_ID);
    this.__extConn = new DataConn(MY_EXT_SERVER_ID);
    
    this.fetchUser = function (email, callback) {
        let msg = {
            email : email,
            mod : "fetchUser.js"
        };

        msg.self = msg;
        this.__finalize(msg, callback);
    };

    this.fetchTasks = function (email, callback) {
        let msg = {
            email : email,
            mod : "fetchTasks.js"

        };

        msg.self = msg;
        this.__finalize(msg, callback);
    };

    this.addTask = function (user, task, callback ) {
        let msg = {
            task : task,
            email : user,
            mod : "addTask.js"
        };

        msg.self = msg;
        this.__finalize(msg, callback);
    };

    this.removeTask = function (user, task, callback) {
        let msg = {
            task : task,
            email : user,
            mod : "removeTask.js"
        }
        this.__finalize(msg, callback);
    }

    this.getTravelCost = function (or, dest, travelMean,  time, callback) {
        let msg = {

            // to be setted at instantiation time
            origin : origin,
            destination : dest,
            departure : time,
            travelMean : travelMean,

            fetch : function (extServicesCallback) {
                const MY_TRAFFIC_ASSUMPTION = "best_guess";

                //TODO change this
                let result = extServicesCallback.fetchRoute(
                    this.origin,
                    this.destination,
                    this.travelMean,
                    this.departure,
                    MY_TRAFFIC_ASSUMPTION
                );

                this.distance = {
                    value : result.rows[0].elements[0].distance.value,
                    text : result.rows[0].elements[0].distance.text
                };

                this.time = {

                    value :  result.rows[0].elements[0].duration.value,
                    text : result.rows[0].elements[0].duration.text
                };

                if (this.travelMean === "TRANSIT"){
                    this.fare = {
                        value : result.rows[0].elements[0].fare.value,
                        text : result.rows[0].elements[0].fare.currency,
                    }
                }
            }

        };
        this.__finalize(msg, callback);
    };

    this.__finalize = function(msg, callback){
        this.connect();
        this.__socket.write(msg);
        var result = null;
        this.__socket.on('data', callback(data));
    }


}

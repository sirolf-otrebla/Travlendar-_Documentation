
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
    
    this._DBConn = new DataConn(MY_DATA_SERVER_ID);
    this._extConn = new DataConn(MY_EXT_SERVER_ID);
    this._DBConn.connect();
    this._extConn.connect();

    this.fetchUser = function (email, ID, callback) {
        let msg = {
            email : email,
            ID : ID,
            mod : "fetchUser.js"
        };

        msg.self = msg;
        this._finalize_db(msg, callback);
    };

    this.fetchTasks = function (email, callback) {
        let msg = {
            email : email,
            mod : "fetchTasks.js"

        };

        msg.self = msg;
        this._finalize_db(msg, callback);
    };

    this.addTask = function (user, task, callback ) {
        let msg = {
            task : task,
            email : user,
            mod : "addTask.js"
        };

        msg.self = msg;
        this._finalize_db(msg, callback);
    };

    this.removeTask = function (user, task, callback) {
        let msg = {
            task : task,
            email : user,
            mod : "removeTask.js"
        }
        this._finalize_db(msg, callback);
    }

    this.getTravelCost = function (or, dest, travelMean,  time, callback) {
        let msg = {

            // to be setted at instantiation time
            origin : origin,
            destination : dest,
            departure : time,
            travelMean : travelMean,
            mod : "travelCost.js"

        };
        this._finalize_ext(msg, callback);
    };

    this.getWeatherForecast = function (callback) {
      let msg = {
          mod : "getWeatherForecast.js"
      }
      this._finalize_ext(msg, callback);
    };


    this._finalize_db = function(msg, callback){
        this._DBConn.write(msg);
        var result = null;
        this.__socket.on('data', callback(data));
    }

    this._finalize_ext = function(msg, callback){
        this._extConn.write(msg);
        var result = null;
        this.__socket.on('data', (data) => {
            let msg = JSON.parse(data);
            callback(msg);
        });
    }

}

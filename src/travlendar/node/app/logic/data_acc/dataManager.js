
let error_handler = require('../error_handler');

function DataConn(ID){
    let __self  = this;
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

    this.fetchUser = function (email, callback) {
        let msg = {
            email : email,
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

    this.fetchGlobalPreferences = function (email, callback) {
        let msg = {
            email : email,
            mod : "fetchGlobalPreferences.js"
        };

        msg.self = msg;
        this._finalize_db(msg, callback);
    };

    this.fetchCalendar = function (email, callback) {
        let msg = {
            email : email,
            mod : "fetchCalendar.js"
        };

        msg.self = msg;
        this._finalize_db(msg, callback);
    };

    this.addUser = function (email, user, callback) {
        let msg = {
            email : email,
            user: user,
            mod : "addUser.js"
        };

        msg.self = msg;
        this._finalize_db(msg, callback);
    };

    this.addTask = function (email, task, callback ) {
        let msg = {
            task : task,
            email : email,
            mod : "addTask.js"
        };

        msg.self = msg;
        this._finalize_db(msg, callback);
    };

    //TODO: check if calendar is build in the proper way
    this.updateCalendar = function (email, calendar, callback) {
        let msg = {
            email : email,
            scheduled_tasks : calendar.scheduled_tasks,
            travels : calendar.travels,
            mod : "updateCalendar.js"
        };

        this._finalize_db(msg, callback);
    };

    this.updateGlobalPreferences = function (email, globalPreferences, callback) {
        let msg = {
            email : email,
            global_preferences : globalPreferences,
            mod : "updateGlobalPreferences.js"
        };

        this._finalize_db(msg, callback);
    };

    this.updateTaskPreferences = function (email, taskPreferences, callback) {
        let msg = {
            email : email,
            task_preferences : taskPreferences,
            mod : "updateTaskPreferences.js"
        };

        this._finalize_db(msg, callback);
    };

    this.removeTask = function (email, idTask, callback) {
        let msg = {
            idTask : idTask,
            email : email,
            mod : "removeTask.js"
        };

        this._finalize_db(msg, callback);
    };

    this.removeUser = function (email, callback) {
        let msg = {
            email : email,
            mod : "removeUser.js"
        };

        this._finalize_db(msg, callback);
    };

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
      };
      this._finalize_ext(msg, callback);
    };


    this._finalize_db = function(msg, callback){
        this._DBConn.write(msg);
        let result = null;
        this.__socket.on('data', callback(data));
    };

    this._finalize_ext = function(msg, callback){
        this._extConn.write(msg);
        let result = null;
        this.__socket.on('data', (data) => {
            let msg = JSON.parse(data);
            callback(msg);
        });
    }

}

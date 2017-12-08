


function DataConn(ID){
    var __self  = this;
    let net = require('net');
    let fs = require('fs');
    let serverList = JSON.parse(fs.readFileSync('./travlendar/node/app/data_acc/serverList.json')).servers;

    this.__connectingTO = serverList[ID];
    this.__socket = new net.socket();
    
    this.connect = function () {
        this.__socket.connect(this.__connectingTO.port, this.__connectingTO.address, function () {
            console.log("CONNECTED TO : " + __self.__connectingTO.port + ":" + __self.__connectingTO.address);
        });
    }

    this.write = function (msg) {
        this.__socket.write(msg);
    };

};

function DataAccess(){

    const MY_DATA_SERVER_ID = 0;
    const MY_EXT_SERVER_ID = 1;
    
    this.__DBConn = new DataConn(MY_DATA_SERVER_ID);
    this.__extConn = new DataConn(MY_EXT_SERVER_ID);
    
    this.fetchUser = function (email, ID) {
        let msg = {

            fetch : function (dbRef) {

            }
        }
        //TODO
    }
    this.fetchTasks = function (user) {
        let msg = {

            fetch : function (dbRef) {

            }
        }
        //TODO
    }

    this.addTask = function (user, task) {
        let msg = {


            fetch : function (dbRef) {

            }
        }
        //TODO
    }

    this.removeTask = function (user, task) {
        let msg = {

            fetch : function (dbRef) {

            }
        }
        //TODO
    }

    this.getTravelCost = function (origin, dest, time) {
        let msg = {

            fetch : function (dbRef) {

            }
        }
        //TODO
    }





}

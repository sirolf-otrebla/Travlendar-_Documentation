let presenter = require('./presenter');
let dataManager = require('../logic/data_acc/dataManager');

let manager = new dataManager.manager();

//FUNCTION TO HANDLE LOGIN
exports.handleLogin = function (message, socket, callbacks) {
    let json = JSON.parse(message);

    if(json.requestedService === 'login') {
        manager.fetchUser(json.email, function(result) {
            if(result.user !== undefined) {
                if(result.user._password === json.password && result.user._email === json.email) {
                    socket.write(JSON.stringify({"email" :json.email, "requestedService": json.requestedService, "loggedIn": "true"}) + '\n');
                    return;
                }
            }
            socket.write(JSON.stringify({"email" :json.email, "requestedService": json.requestedService, "loggedIn": "false"}) + '\n');
        });
    } else
        presenter.nextCallback(message, socket, callbacks);
};

//FUNCTION TO HANDLE THE ERROR IN PRESENTER
exports.handleError = function (message, socket) {
    let json = JSON.parse(message);
    console.log(json.toString());
    socket.write(JSON.stringify({"email":json.email,"requestedService":json.requestedService,"errorType":"Message isn't recognised"}) + '\n');
};


exports.handleAddTask = function (message,socket, callbacks) {
    let json = JSON.parse(message);
    if(json.requestedService === 'addTask') {
        console.log('The Application Server received a Login Message');
    } else
        presenter.nextCallback(message, socket, callbacks);
}

exports.handleRemoveTask = function (message,socket, callbacks) {
    let json = JSON.parse(message);
    if(json.requestedService === 'removeTask') {
        console.log('The Application Server received a Login Message');
    } else
        presenter.nextCallback(message, socket, callbacks);
}

exports.handleModifyTask = function (message,socket, callbacks) {
    let json = JSON.parse(message);
    if(json.requestedService === 'modifyTask') {
        console.log('The Application Server received a Login Message');
    } else
        presenter.nextCallback(message, socket, callbacks);
}


exports.handleGetSchedule = function (message,socket, callbacks) {
    let json = JSON.parse(message);
    if(json.requestedService === 'getSchedule') {
        console.log('The Application Server received a Login Message');
    } else
        presenter.nextCallback(message, socket, callbacks);
};


exports.handleModifyPrefs = function (message,socket, callbacks) {
    let json = JSON.parse(message);
    if(json.requestedService === 'modifyPrefs') {
        console.log('The Application Server received a Login Message');
    } else
        presenter.nextCallback(message, socket, callbacks);
}


exports.handleGetPrefs = function (message,socket, callbacks) {
    let json = JSON.parse(message);
    if(json.requestedService === 'getPrefs') {
        console.log('The Application Server received a Login Message');
    } else
        presenter.nextCallback(message, socket, callbacks);
}






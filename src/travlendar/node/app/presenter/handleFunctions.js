let presenter = require('./presenter');
let dataManager = require('../logic/data_acc/dataManager');

let manager = new dataManager.manager();

//FUNCTION TO HANDLE LOGIN
exports.handleLogin = function (message, socket, callbacks) {
    let json = JSON.parse(message);

    if(json.requestedService === 'login') {
        manager.fetchUser(json.email, function(result) {
            if(result.user !== undefined) {
                if(result.user.Password === json.password && result.user.eMail === json.email) {
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


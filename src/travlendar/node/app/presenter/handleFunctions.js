let presenter = require('./presenter');

//FUNCTION TO HANDLE LOGIN
exports.handleLogin = function (message, socket, callbacks) {
    let json = JSON.parse(message);

    if(json.requestedService === 'login') {
        console.log('The Application Server received a Login Message');
    } else
        presenter.nextCallback(message, socket, callbacks);
};

//FUNCTION TO HANDLE THE ERROR IN PRESENTER
exports.handleError = function (message, socket) {
    let json = JSON.parse(message);
    console.log(json.toString());
    socket.write(JSON.stringify({"email":json.email,"requestedService":json.requestedService,"errorType":"Message isn't recognised"}));
};


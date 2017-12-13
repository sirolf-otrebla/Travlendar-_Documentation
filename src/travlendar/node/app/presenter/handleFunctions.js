let presenter = require('./presenter');

//FUNCTION TO HANDLE LOGIN
exports.handleLogin = function (message, socket, callbacks) {
    let json = JSON.parse(message);

    if(message.requestedFunction === 'login') {
        console.log('The Application Server received a Login Message');
    } else
        presenter.nextCallback(message, socket, callbacks);
};

//FUNCTION TO HANDLE THE ERROR IN PRESENTER
exports.handleError = function (message, socket) {
    console.log(message.toString());
    socket.write(message);
};


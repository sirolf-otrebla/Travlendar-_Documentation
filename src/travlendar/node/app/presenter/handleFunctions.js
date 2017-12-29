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


exports.handleAddTask = function (message,socket, callbacks) {
    let json = JSON.parse(message);
    if(message.requestedFunction === 'addTask') {
        console.log('The Application Server received a Login Message');
    } else
        presenter.nextCallback(message, socket, callbacks);
}

exports.handleRemoveTask = function (message,socket, callbacks) {
    let json = JSON.parse(message);
    if(message.requestedFunction === 'removeTask') {
        console.log('The Application Server received a Login Message');
    } else
        presenter.nextCallback(message, socket, callbacks);
}

exports.handleModifyTask = function (message,socket, callbacks) {
    let json = JSON.parse(message);
    if(message.requestedFunction === 'modifyTask') {
        console.log('The Application Server received a Login Message');
    } else
        presenter.nextCallback(message, socket, callbacks);
}


exports.handleGetSchedule = function (message,socket, callbacks) {
    let json = JSON.parse(message);
    if(message.requestedFunction === 'getSchedule') {
        console.log('The Application Server received a Login Message');
    } else
        presenter.nextCallback(message, socket, callbacks);
};


exports.handleModifyPrefs = function (message,socket, callbacks) {
    let json = JSON.parse(message);
    if(message.requestedFunction === 'modifyPrefs') {
        console.log('The Application Server received a Login Message');
    } else
        presenter.nextCallback(message, socket, callbacks);
}


exports.handleGetPrefs = function (message,socket, callbacks) {
    let json = JSON.parse(message);
    if(message.requestedFunction === 'getPrefs') {
        console.log('The Application Server received a Login Message');
    } else
        presenter.nextCallback(message, socket, callbacks);
}






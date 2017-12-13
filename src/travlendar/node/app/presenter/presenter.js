//THIS REPRESENT THE PRESENTER

/*
    IMPORTANT: Each callback function that handle the input should has 3 parameters:
                -   Message:    the variable that represents the received message
                -   Socket:     the socket that will be used to write the response
                -   Callbacks:  The list of left callback functions, used to called the next function
 */

//Function used to start the presenter
exports.start = function (message, socket, callbacks, errorHandler) {
    let next = callbacks[0];

    callbacks.splice(0, 1);

    callbacks.push(errorHandler);

    next(message, socket, callbacks);
};

//Function used in each callback function to call the next function which will handle the message
exports.nextCallback = function (message, socket, callbacks) {
    let next = callbacks[0];

    callbacks.splice(0, 1);

    next(message, socket, callbacks);
};

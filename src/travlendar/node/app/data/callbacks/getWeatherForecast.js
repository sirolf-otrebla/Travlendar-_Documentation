exports.fetch = function (msg, callback) {
    let ext = require('external.js');
    var self = msg;
    ext.weatherForecast((result) => {
        self.forecastArray = result.list;
        callback(self);
    });
};
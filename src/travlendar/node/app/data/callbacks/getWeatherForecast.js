exports.fetch = function (msg) {
    let ext = require('external.js');
    var self = msg;
    ext.weatherForecast((result) => {
        self.forecastArray = result.list;
    });
};
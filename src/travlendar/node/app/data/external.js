const GOOGLE_API_KEY = "AIzaSyAwQgUTfp_WBPRomr1S-HI5SZBAiyr6PYM";
const DISTANCE_MATRIX_API_HOST = "maps.googleapis.com";
const DISTANCE_MATRIX_API_PATH = "/maps/api/distancematrix/json?";
const WEATHER_API_HOST = "api.openweathermap.org";
const WEATHER_API_PATH = "/data/2.5/forecast?";
const WEATHER_API_KEY = "9301c5733b820cf2c6860598a68d547c";
const CITY_ID = 3173435;

//fetchRoute("viale romagna 62, Milano, IT", "via istonia 104, Cupello, CH, IT",  travelMeans.driving, "now" , "best_guess");

exports.fetchRoute = function fetchRoute(origin, dest, travelMean, time, traffic, callback){
    let http = require("https");
    let queryString = require('querystring');
    let opt = {
        origins :origin.replace(/\s/g, '+'),                  // need to replace spaces with + (
        destinations : dest.replace(/\s/g, '+'),
        departure_time : time,
        traffic_model: traffic,
        mode : travelMean,
        key : GOOGLE_API_KEY
    };
    let strOpt = queryString.stringify(opt, "&", "=", {encode: false});
    console.log("REQ" + strOpt);

    var self = this;
    http.get({
        protocol : "https:",
        host : DISTANCE_MATRIX_API_HOST,
        path: DISTANCE_MATRIX_API_PATH + strOpt,
        port : 443
        },
        function (res) {
            console.log("REQ STATUS:" + res.statusCode);
            res.on("data", function(chunk) {
                console.log("BODY: " + chunk);
                self.result = JSON.parse(chunk);
                callback(self.result);
            });

    });

};


exports.weatherForecast = function(callback) {
    let http = require("http");
    let self = this;
    let queryString = require('querystring');
    console.log("REQ" + WEATHER_API_HOST + WEATHER_API_PATH + CITY_ID);
    let opt = {
        id : CITY_ID,
        APPID : WEATHER_API_KEY
    };
    let strOpt = queryString.stringify(opt, "&", "=", {encode: false});

    http.get({
        protocol : "http:",
        host : WEATHER_API_HOST,
        path : WEATHER_API_PATH + strOpt,
        port : 80
    }, function (res){
        console.log("REQ STATUS:" + res.statusCode);
        res.on("data", function(chunk) {
            console.log("BODY: " + chunk);
            self.result = JSON.parse(chunk);
            callback(self.result);
        });
    });


};


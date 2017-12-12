const GOOGLE_API_KEY = "AIzaSyAwQgUTfp_WBPRomr1S-HI5SZBAiyr6PYM";
const DISTANCE_MATRIX_API_HOST = "maps.googleapis.com";
const DISTANCE_MATRIX_API_PATH = "/maps/api/distancematrix/json?";
const WEATHER_API_HOST = "api.openweathermap.org";
const WEATHER_API_PATH = "/data/2.5/forecast?id=524901";
const CITY_ID = 3173435;

const travelMeans  = {
    driving : "DRIVING",
    bycicling : "BYCICLING",
    transit : "TRANSIT",
    walking : "WALKING"
};

export {
    travelMeans
};

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
                callback(result);
            });

    });

};

exports.weatherForecast = function(timeslot, callback) {
    let http = require("http");
    let queryString = require('querystring');
    let self = this;
    console.log("REQ" + WEATHER_API_HOST + WEATHER_API_PATH + CITY_ID);
    http.get({
        protocol : "http:",
        host : WEATHER_API_HOST,
        path : WEATHER_API_PATH + CITY_ID,
        port : 80
    }, function (res){
        console.log("REQ STATUS:" + res.statusCode);
    });

};
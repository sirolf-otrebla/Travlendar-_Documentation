const GOOGLE_API_KEY = "AIzaSyAwQgUTfp_WBPRomr1S-HI5SZBAiyr6PYM";
const DISTANCE_MATRIX_API_HOST = "maps.googleapis.com";
const DISTANCE_MATRIX_API_PATH = "/maps/api/distancematrix/json?";
const travelMeans  = {
    driving : "DRIVING",
    bycicling : "BYCICLING",
    transit : "TRANSIT",
    walking : "WALKING"
}

//fetchRoute("viale romagna 62, Milano, IT", "via istonia 104, Cupello, CH, IT",  travelMeans.driving, "now" , "best_guess");

function fetchRoute(origin, dest, travelMean, time, traffic){
    let http = require("https");
    let queryString = require('querystring');
    let or = origin.replace(/\s/g, '+');
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
            });

    });

    return this.result;
}
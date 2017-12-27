exports.INF = -1;
const  INF = -1;

const ALPHA = 1;
const BETA = 1;

let ent = require("../entities");

exports.eval = function evaluator(day, travel){

    const TRANSPORTS_NO_BAD_WEATHER = [ent.travelMeans.walking, ent.travelMeans.bycicling];
    const BAD_WEATHER = [];
    const MEANS_WITH_FARE = [];

    let data = require('../data_acc/dataManager');
    let manager = new data.manager();
    if (TRANSPORTS_NO_BAD_WEATHER.includes(travel.transport) && BAD_WEATHER.includes(day.weather) ){
        this.result =  INF;
    }
    let self = this;

    manager.getTravelCost(
        travel.startTask.location,
        travel.endTask.location,
        travel.transport,
        travel.startTask.timeSlot.end,
        (msg) => {
            let arrival = msg.departure + msg.time.value;
            if (arrival > travel.endTask.timeSlot.start){
                self.result =  INF;
            }
            if (MEANS_WITH_FARE.includes(msg.travelMean)){
                self.result =  _cost(msg.time.value, msg.fare.value);
            } else {
                self.result =  _cost(msg.time.value, 0);
            }
        });
};

_cost = function (time, fare) {
    return time*ALPHA + fare*BETA;
};

/** Evaluate the cost of a partial schedule solution considering:
*   travel duration and cost
*   additional travels for vehicle re-take
*   weather forecast
*   travel mean preferences
*/
exports.scheduleEval = function scheduleEvaluator(schedule, callback){

    //Set up the proper requirements and support variables
    schedule.next_increment = 0;
    let self = this;
    self.callback = callback;
    let data = require('../data_acc/dataManager');
    let manager = new data.manager(); //Blocking code here!!!
    let async = require('async');

    //Build the array of non blocking functions to use with waterfall
    //Remember to separate datamanager functions from data consuming functions
    let callbacks = [
        //Ask the cost of the last added task
        setupTravelCost,
        //Evaluate travels cost and time duration
        evalTimeAndCost,
        //Evaluate possibility of vehicle retake
        evalVehicleRetake,
        //Evaluate weather forecast w.r.t. travel means
        //TODO: is this necessary? also check kind of task vs travel mean??
        evalWeatherForecast,
        //Evaluate travels mean preferences
        evalTravelMeanPreferences
    ];

    async.waterfall( callbacks, function (err, schedule) {
        if(err)
            console.log("error in the cost evaluation: " + err);
        console.log("cost computation finished, increment = " + schedule.next_increment);
        self.callback(schedule);
    });

};

setupTravelCost = function (dataManager, schedule, callback) {
    let self = this;
    this.next = callback;
    let travel = schedule.travels[schedule.travels.length -1];

    dataManager.getTravelCost(
        travel.startTask.location,
        travel.endTask.location,
        travel.transport,
        travel.startTask.timeSlot.end,
        function (msg) {
            self.next(null, msg, dataManager, schedule);
        }
    );
};

evalTimeAndCost = function (travel, dataManager, schedule, callback ) {

    const MEANS_WITH_FARE = [ent.travelMeans.transit];

    let arrival = travel.departure + travel.time.value;

    //Check if arrival in time is granted
    if (arrival > travel.endTask.timeSlot.start){
        schedule.last_cost_increment = INF;
    }

    //Check and evaluate travel costs
    if (MEANS_WITH_FARE.includes(travel.travelMean)){
        schedule.next_increment =  _cost(travel.time.value, travel.fare.value);
    } else {
        schedule.next_increment =  _cost(travel.time.value, 0);
    }

    //Call next function
    if(schedule.next_increment === INF) {
        let err = {
            description: "Arrival in time cannot be granted"
        };
        callback(err, travel, dataManager, schedule);
    } else
        callback(null, travel, dataManager, schedule);

};

evalVehicleRetake = function (travel, dataManager, schedule, callback) {

    //Check if the last travel use a different vehicle

    //Call next function
    callback(null, travel, dataManager, schedule);

};

evalWeatherForecast = function (travel, dataManager, schedule, callback) {

    const BAD_WEATHER = [];
    const TRANSPORTS_NO_BAD_WEATHER = [ent.travelMeans.walking, ent.travelMeans.bycicling];

    //Add the cost of the selected travel mean for the given forecast
    if (TRANSPORTS_NO_BAD_WEATHER.includes(travel.transport) && BAD_WEATHER.includes(schedule.day.weather) ){
        schedule.next_increment =  INF;
    }

    //Call next function
    if(schedule.next_increment === INF) {
        let err = {
            description: "Cannot use this travel mean due to the weather forecast"
        };
        callback(err, travel, dataManager, schedule);
    } else
        callback(null, travel, dataManager, schedule);

};

evalTravelMeanPreferences = function (travel, dataManager, schedule, callback) {

    //Add the cost of the selected travel mean given the user preferences
    //TODO: check if it works (exist trav_mean_pref as a field? is it a map? where is it fetched? exist in the db??)
    schedule.next_increment += travel.travelMean * schedule.travel_mean_preferences.get(travel.travelMean);

    //Call next function
    if(schedule.next_increment === INF) {
        let err = {
            description: "Cannot use this travel mean due to the user preferences"
        };
        callback(err, schedule);
    } else
        callback(null, schedule);

};


exports.INF = -1;
const  INF = -1;

const ALPHA = 1;
const BETA = 1;

let ent = require("../entities");
let async = require('async');
let whilst = require('async/whilst');

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
        self.callback(schedule.next_increment);
    });

};
/**
 *
 * @param schedule - same as the other function
 * @param callback - callback receives RESULT as parameter
 */
exports.completeScheduleEval = function completeScheduleEvaluator(schedule, callback){

    let data = require('../data_acc/dataManager');
    let manager = new data.manager(); //Blocking code here!!!

    let index = 0;
    let cost = 0;

    whilst( function () {
                //Test to know when to finish iterating over the tasks
                return index < schedule.tasks.length;
            },
            function (callback2) {

                //Functions for cost eval of a single schedule element
                async.waterfall([function (cb) {
                        //Set up travel cost
                        setupTravelCost(manager, schedule, index, cb);
                    }

                ], function (err, result) {
                    //Function executed when the all the functions that calc the cost are exec
                    if(err) {
                        callback2(err);
                        return;
                    }
                    index++;
                    cost += result.next_increment;
                } );
            },
            function (err, result) {
            //Function for handling the final cost of the schedule result
                if(err)
                    console.log("error occurred during cost evaluation " + err);
                callback(result);
            }
        );

};

function setupTravelCost(dataManager, schedule, index, callback) {
    let self = this;
    this.next = callback;
    let travel = schedule.travels[index];
    if(travel !== undefined) {
        dataManager.getTravelCost(
            travel.startTask.location,
            travel.endTask.location,
            travel.transport,
            //travel.startTask.timeSlot.end,
            travel.startTask.endTimeMls, //Start the travel when the previous task finishes
            function (msg) {
                self.next(null, msg, dataManager, schedule);
            }
        );
    }
    else {
        let err = "Error: travel in position " + index + " is undefined!";
        callback(err);
    }
}

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


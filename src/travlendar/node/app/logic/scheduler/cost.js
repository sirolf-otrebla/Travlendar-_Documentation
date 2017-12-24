exports.INF = -1;
const  INF = -1;

const ALPHA = 1;
const BETA = 1;

exports.eval = function evaluator(day, travel){
    let ent = require("../entities");
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
exports.scheduleEval = function scheduleEvaluator(schedule){

    //Set up the proper requirements and support variables
    schedule.next_increment = 0;

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
}

evalTimeAndCost = function (travel, dataManager, schedule, callback ) {

    let arrival = travel.departure + travel.time.value;
    const MEANS_WITH_FARE = [];

    //Check if arrival in time is granted
    if (arrival > travel.endTask.timeSlot.start){
        schedule.last_cost_increment = INF;
    }

    //Check and evaluate travel costs
    if (MEANS_WITH_FARE.includes(travel.travelMean)){
        self.next_increment =  _cost(travel.time.value, travel.fare.value);
    } else {
        self.next_increment =  _cost(travel.time.value, 0);
    }

    //Call next function
    callback(null, travel, dataManager, schedule);

};

evalVehicleRetake = function (travel, dataManager, schedule, callback) {

    //Check if the last travel use a different vehicle

};

evalWeatherForecast = function (travel, dataManager, schedule, callback) {

};

evalTravelMeanPreferences = function (travel, dataManager, schedule, callback) {

};


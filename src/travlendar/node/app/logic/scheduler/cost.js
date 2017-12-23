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


    async .parallel([
    ]);
    let cost = 0;

    let callbacks = [
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

    callbacks.forEach((f) => {
        f(schedule);
    })


};

evalTimeAndCost = function (schedule) {
    let self = this;
    let travels = schedule.travels;
    let lastTravel = travels.get(travels.length - 1);

    let data = require('../data_acc/dataManager');
    let manager = new data.manager();

};

evalVehicleRetake = function (schedule) {

};

evalWeatherForecast = function (schedule) {

};

/**
 *
 * @param schedule
 */
evalTravelMeanPreferences = function (schedule) {

};


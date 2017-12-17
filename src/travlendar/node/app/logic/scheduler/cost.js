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
        return INF;
    }
    manager.getTravelCost(
        travel.startTask.location,
        travel.endTask.location,
        travel.transport,
        travel.startTask.timeSlot.end,
        (msg) => {
            let arrival = msg.departure + msg.time.value;
            if (arrival > travel.endTask.timeSlot.start){
                return INF;
            };
            if (MEANS_WITH_FARE.includes(msg.travelMean)){
              return _cost(msg.time.value, msg.fare.value);
            } else {
                return _cost(msg.time.value, 0);
            }
        });
};

_cost = function (time, fare) {
    return time*ALPHA + fare*BETA;
};

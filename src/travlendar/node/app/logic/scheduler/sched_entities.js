class weekDay {
    _ent;
    _day;
    _taskDurationSum;
    _distanceFromBarycenterSum;
    _bRes;

    constructor(time){
        const DEFAULT_WEAT = "" ;
        this._ent = require("../entities");
        this._day = new this._ent.Day(time, DEFAULT_WEAT);
        this._taskDurationSum = 0;
        this._distanceFromBarycenterSum = 0;
        this._bRes = null;
    }

    prb(task, dayList) {
        let num = this._taskDurationSum +
            BETA*this._distanceFromBarycenterSum +
            GAMMA*this._distance(task.location, this._bRes);
        let den = 0;
        dayList.forEach((d) => {
            den += d.taskDurationSum + d.distanceFromBarycenterSum
                + this._distance(task.location, d.barycenter());
        });

        if (den === 0 ) return 1/dayList.length;
        if (num === 0 && den !== 0) {
            let nEmptyDays = 0;
            dayList.forEach((d) => {
                if ((d.list.length > 0)) {
                    nEmptyDays++;
                }
            });

            return 1/nEmptyDays;
        }
        return 1- num/den;
    }

    _barycenter(day){
        if (day.length === 0) return null;
        this._ent = require("../entities");
        var sumLat = 0;
        var sumLong = 0;
        day.forEach((a) => {
            sumLat += a.location.lat;
            sumLong += a.location.long;
        })
        return new this._ent.Loc(sumLat/day.length, sumLong/day.length, "barycenter");
    };

    addTask(t){
        this._day.list.push(t);
        this._taskDurationSum = 0;
        this._day.list.forEach((t) => {
            this._taskDurationSum += t.timeSlot.duration;
        })
        this._bRes = this._barycenter(this._day);
        this._day.list.forEach((t) => {
            this._distanceFromBarycenterSum =
                this._distance(t.location, this._barycenter());
        })

    }

    static _distance(location, location2){
        if (location2 === null) return 0;
        return Math.sqrt(
            (location.lat - location2.lat)^2 +
            (location.long -location2.long)^2
        );
    }


    get taskDurationSum() {
        return this._taskDurationSum;
    }


    get distanceFromBarycenterSum() {
        return this._distanceFromBarycenterSum;
    }


    get barycenter() {
        return this._bRes;
    }


    get time() {
        return this._day.time;
    }
}

class DaySchedule{
    _day;
    _cost;
    _lastTravelCost;
    _travelList;
    _taskList;

    incrementCost(calculator, callback){
        calculator.scheduleEval({
            tasks: this.taskList,
            travels : this.travelList
        }, (increment) => {
            this._lastTravelCost = increment;
            this._cost += increment;
            callback(this, increment);
        });

    }

    decrementCost(){
        this._cost -= this._lastTravelCost;
    }
    addTravel(trav){
        if ( trav.startTask === this.taskList.pop() ||
            this.taskList.length === 0) {

            this._taskList.push(trav.startTask)
            this._travelList.push(trav);
            this._taskList.push(trav.endTask);

        }
    }

    calculateCost(callback) {
    }

    removeLastTravel(){
        this._cost -= this._lastTravelCost;
        this._taskList.pop();
        this._travelList.pop();
    }

    get cost() {
        return this._cost;
    }


    get taskList() {
        return this._taskList;
    }


    get travelList() {
        return this._travelList;
    }
}

distance = function(location, location2){
    if (location2 === null) return 0;
    return Math.sqrt(
        (location.lat - location2.lat)^2 +
        (location.long -location2.long)^2
    );
};


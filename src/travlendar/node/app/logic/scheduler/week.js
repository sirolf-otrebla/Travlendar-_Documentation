const BETA = 1;
const GAMMA = 1;
exports.schedule = function (tasks) {
    let week = [];
    for(i = 0; i < 7; i++){
        week[i] = new weekDay();
    };

    tasks.forEach((task) => {
        let accumulator = 0;
        week.forEach((wd) => {
            wd.lowerBound = accumulator;
            accumulator += wd.prb(task, week);
            wd.upperBound = accumulator;
        } );

        let rand = Math.random();
        for ( i = 0; i < week.length ; i++) {
            if (week[i].upperBound > rand && week[i].lowerBound <= rand){
                wd.addTask(task);
            }
            break;
        }
    });

};

class weekDay {
    _ent;
    _day;
    _taskDurationSum;
    _distanceFromBarycenterSum;
    _bRes;

    constructor(){
        this._ent = require("../entities");
        this._day = new this._ent.Day(/* TODO ADD WEATHER */);
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
}

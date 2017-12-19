exports.User = class User {
    _email;

    constructor(email){
        this._email = email;
    }

    get email(){
        return this._email;
    }

};

exports.travelMeans  = {
    driving : "DRIVING",
    bycicling : "BYCICLING",
    transit : "TRANSIT",
    walking : "WALKING"
};

exports.Day = class Day {
    _list;
    _weather;


    constructor(weather) {
        this._weather = weather;
        this._barycenter = null;
    }

    get barycenter() {
        return this._barycenter;
    }

    addToList(day){
        this._list.push(day);
    }

    getFromList(){
        this._list.pop();
    }
    get weather() {
        return this._weather;
    }


    get list() {
        return this._list;
    }
}

exports.Task = class Task {
    _ID;
    _userEmail;
    _description;
    _location;
    _timeSlot;
    _allowedTransports;
    _repetition;

    constructor(id, desc, loc, timeslot, transports) {
        this._ID = id;
        this._description = desc;
        this._location = loc;
        this._timeSlot = timeslot;
        this._allowedTransports = transports;
    }


    get ID() {
        return this._ID;
    }

    get userEmail() {
        return this._userEmail;
    }

    get description() {
        return this._description;
    }

    get location() {
        return this._location;
    }

    get timeSlot() {
        return this._timeSlot;
    }

    get allowedTransports() {
        return this._allowedTransports;
    }

    get repetition() {
        return this._repetition;
    }
};

exports.Travel = class Travel{
    _startTask;
    _endTask;
    _transport;
    _route;


    constructor(startTask, endTask, transport,) {
        this._startTask = startTask;
        this._endTask = endTask;
        this._transport = transport;
    }


    get startTask() {
        return this._startTask;
    }

    get endTask() {
        return this._endTask;
    }

    get transport() {
        return this._transport;
    }

    get route() {
        return this._route;
    }
};

exports.TimeSlot = class Timeslot{
    _start;
    _end;
    _duration;


    constructor(start, end) {
        this._start = start;
        this._end = end;
        this._duration = end - start;
    }

    get duration() {
        return this._duration;
    }

    get start() {
        return this._start;
    }

    get end() {
        return this._end;
    }

//TODO: ADD WEATHER ???
};

exports.Loc = class Loc{
    _lat;
    _long;
    _desc;


    constructor(lat, long, desc) {
        this._lat = lat;
        this._long = long;
        this._desc = desc;
    }


    get lat() {
        return this._lat;
    }

    get long() {
        return this._long;
    }

    get desc() {
        return this._desc;
    }

    whithinWorkingArea(){

        // this is a square defined using Arcore, Saronno and San Giuliano Milanese as bounds.
        const MAX_LAT = 45.631851;
        const MAX_LONG = 9.324189;
        const MIN_LAT = 45.397856;
        const MIN_LONG = 9.000609 ;

        if ( __lat > MIN_LAT && __lat < MAX_LAT){
            if (__long > MIN_LONG && __long < MAX_LONG){
                return true
            }
        }
        return false
    }

};









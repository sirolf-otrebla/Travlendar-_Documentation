exports.User = class User {

    constructor (idUser, email, name, surname, password, user_residence){
        this._idUser = idUser;
        this._email = email;
        this._name = name;
        this._surname = surname;
        this._password = password;
        this._user_residence = user_residence;
    }

    get idUser(){
        return this._idUser;
    }

    get email(){
        return this._email;
    }

    get name(){
        return this._name;
    }

    get surname(){
        return this._surname;
    }

    get password(){
        return this._password;
    }

    get user_residence(){
        return this._user_residence;
    }
};

exports.travelMeans  = {
    driving : "DRIVING",
    bycicling : "BYCICLING",
    transit : "TRANSIT",
    walking : "WALKING"
};

exports.Day = class Day {

    constructor(weather) {
        this._weather = weather;
        this._barycenter = null;
        this._list = [];
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
};

exports.Task = class Task {

    constructor(idTask, idUser, name, desc, loc, duration,
                startTime, endTime, startDay, endDay, isBreakTask,
                isPeriodic, dayPeriodicity, preferences) {
        this._ID = idTask;
        this._idUser = idUser;
        this._name = name;
        this._description = desc;
        this._location = loc;

        this._duration = duration;
        this._startTime = startTime;
        this._endTime = endTime;
        this._startDay = startDay;
        this._endDay = endDay;

        this._isBreakTask = isBreakTask;
        this._dayPeriodicity = 0;
        if(isPeriodic)
            this._dayPeriodicity = dayPeriodicity;

   //     this._allowedTransports = transports;
        this._preferences = preferences;
        // TODO: NEED TO ADD TIMESLOTS
    }

    allowedTransports(){
        //TODO
    }

    get ID() {
        return this._ID;
    }

    get idUser() {
        return this._idUser;
    }

    get name(){
        return this._name;
    }

    get description() {
        return this._description;
    }

    get location() {
        return this._location;
    }

    get duration() {
        return this._duration;
    }

    get startTime() {
        return this._startTime;
    }

    get startTimeMls() {
        return Date.parse(this._startDay + this._startTime);
    }

    get endTime() {
        return this._endTime;
    }

    get endTimeMls() {
        let c = this._endDay + "T" + this._endTime + ".000";
        return Date.parse(c);
    }

    get startDay() {
        return this._startDay;
    }

    get endDay() {
        return this._endDay;
    }

    get preferences() {
        return this._preferences;
    }

    get isBreakTask() {
        return this._isBreakTask;
    }

    get dayPeriodicity() {
        return this._dayPeriodicity;
    }


    get timeSlot() {
        return this._timeSlot;
    }

};

exports.TaskPreferences = class TaskPreferences {

    constructor(takeCar, takeBus, takeCarSharing, takeBikeSharing, maxWalk) {
        this._takeCar = takeCar;
        this._takeBus = takeBus;
        this._takeCarSharing = takeCarSharing;
        this._takeBikeSharing = takeBikeSharing;
        this._maxWalk = maxWalk;
    }

    get takeCar() {
        return this._takeCar;
    }

    get takeBus() {
        return this._takeBus;
    }

    get takeCarSharing() {
        return this._takeCarSharing;
    }

    get takeBikeSharing() {
        return this._takeBikeSharing;
    }

    get maxWalk() {
        return this._maxWalk;
    }

};

let t_pref = require('./entities').TaskPreferences;

exports.GlobalPreferences = class GlobalPreferences extends t_pref{

    constructor(takeCar, takeBus, takeCarSharing, takeBikeSharing, maxWalk, hasSeasonTicket) {
        super(takeCar, takeBus, takeCarSharing, takeBikeSharing, maxWalk);
        this._hasSeasonTicket = hasSeasonTicket;

    }

    get hasSeasonTicket(){
        return this._hasSeasonTicket;
    }
};

exports.Travel = class Travel{
 /*   _startTask;
    _endTask;
    _transport;
    _route;
*/

    constructor(startTask, endTask, transport) {
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
  /*  _start;
    _end;
    _duration;
*/
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

    overlapped(timeSlot){
        if ( timeSlot.start > this.start && timeSlot.start < this.end)
            return true;
        return false;
    }

    containedIn(timeSlot){
        if (timeSlot.start < this.start && timeSlot.end > this.end)
            return true;
        return false;
    }

//TODO: ADD WEATHER ???
};


exports.Loc = class Loc{
  /*  _lat;
    _long;
    _desc;
*/

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









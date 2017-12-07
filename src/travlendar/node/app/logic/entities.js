User = {
    __ID : null,
    __email : null,
    __self : this,
    User : function(email){
        __email = email;
    }

};

Task = {
    __self : this,
    __ID : null,
    __userID : null,
    __description : null,
    __location : null,
    __timeSlot : null,
    __allowedTransports : null,
    __repetition : null,


    Task : function (id, desc, loc, timeslot, transports) {
        __ID = id;
        __description = desc;
        __location = loc;
        __timeSlot = timeslot;
        __allowedTransports = transports;

    }



};

Travel = {
    __startTask : null,
    __endTask : null,
    __transport : null,
    __route : null,

    Task : function (start, end, transport, route) {
        __startTask = start;
        __endTask = end;
        __transport = transport;
        __route = route;
    }
};



TimeSlot = {
    __self : this,


};


Loc = {
    __lat : null,
    __long : null,
    __desc : " ",
    __self : this,

    Location : function (desc, lat,long) {
        __lat = lat;
        __long = long;
        __desc = desc;

    },

    whithinWorkingArea : function(){

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
    },

    getLat : function () {
        return __lat;
    },

    getLong : function () {
        return __long;
    }

};








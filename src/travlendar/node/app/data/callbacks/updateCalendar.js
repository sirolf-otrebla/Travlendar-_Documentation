let error_handler = require('../../logic/error_handler');

exports.fetch = function updateCalendar(msg, dbRef, callback) {
    let self = this;
    this.msg = msg;
    let scheduled_tasks = self.msg.scheduled_tasks;
    let travels = self.msg.travels;

    //Delete all the previously scheduled tasks and travels
    dbRef.query("DELETE cl.*, tr.* " +
                "FROM travlendardb.calendars AS cl " +
                "INNER JOIN travlendardb.travels AS tr " +
                "ON (cl.IdTask = tr.IdStartTask OR cl.IdTask = tr.IdDestinationTask) " +
                "WHERE cl.idUser IN (SELECT u.idUser " +
                "FROM travlendardb.users AS u " +
                "WHERE u.eMail = ?)",
                [self.msg.email],
                function (err) {
                    if(err){
                        self.msg.err = error_handler.query_error(err);
                        callback(self.msg);
                        return;
                    }
                });

    //Insert the scheduled travels
    for(let i = 0; i < scheduled_tasks.length; i++){
        dbRef.query("INSERT INTO travlendardb.Calendars" +
                    "(IdUser, IdTask, StartDate, EndDate, StartTime, EndTime) " +
                    "VALUES ( ( SELECT u.IdUser FROM travlendardb.Users AS u " +
                    "WHERE u.eMail = ?), ?, ?, ?, ?, ?)",
            [self.msg.email, scheduled_tasks[i].idTask, scheduled_tasks[i].startDate,
                scheduled_tasks[i].endDate, scheduled_tasks[i].startTime, scheduled_tasks[i].endTime],
            function (err, result) {
                if (err) {
                    self.msg.err = error_handler.query_error(err);
                    callback(self.msg);
                    return;
                }
                self.msg.status[i] = result;
            }
        );
    }

    //Insert the travels
    for(let i = 0; i < travels.length; i++){
        dbRef.query("INSERT INTO travlendardb.Travels" +
                    "(IdTravel, IdStartTask, IdDestinationTask, " +
                    "StartPointLatitude, StartPointLongitude, EndPointLatitude, EndPointLongitude, " +
                    "TransportMean, Duration) " +
                    "VALUES ( null, ?, ?, ?, ?, ?, ?, ?, ?)",
            [travels[i].idStartTask, travels[i].idDestinationTask,
                travels[i].startPointLatitude, travels[i].startPointLongitude,
                travels[i].endPointLatitude, travels[i].endPointLongitude,
                travels[i].transportMean, travels[i].duration],
            function (err, result) {
                if (err) {
                    self.msg.err = error_handler.query_error(err);
                    callback(self.msg);
                    return;
                }
                self.msg.status[i] = result;
                callback(self.msg);
            }
        );
    }
};
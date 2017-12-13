var error_handler = require('../../logic/error_handler');

exports.fetch = function updateCalendar(msg, dbRef) {

    dbRef.connect(function (err, msg) {
        if(err){
            msg.err = msg.error_handler.db_connection_error(err);
            return;
        }

        var scheduled_task = msg.scheduled_task;

        //first remove (done by a trigger) then insert
        dbRef.query("INSERT INTO travlendardb.Calendars( " +
            "IdUser, IdTask, StartDate, EndDate, StartTime, EndTime) " +
            "VALUES ( (SELECT u.IdUser FROM travlendardb.Users AS u " +
                        "WHERE u.eMail = ?), ?, ?, ?, ?, ?)",
            [msg.email, scheduled_task.idTask, scheduled_task.startDate,
                scheduled_task.endDate, scheduled_task.startTime, scheduled_task.endTime],
            function (err, result) {
                if(err){
                    msg.err = error_handler.query_error(err);
                    return;
                }
                msg.status = result;
                return;
            }
        );
    });
}
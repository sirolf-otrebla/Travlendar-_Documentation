var error_handler = require('../../logic/error_handler');

exports.fetch = function addTask(msg, dbRef) {

    dbRef.connect(
        function (err, msg) {
            if(err){
                msg.err = error_handler.db_connection_error(err);
                return;
            }

            let task = msg.task;
            let user = msg.user;

            dbRef.query("INSERT INTO travlendardb.Tasks("  +
                        "IdTask, IdUser, Name, Description," +
                        "Latitude, Longitude, Duration," +
                        "StartTime, EndTime, StartDay, EndDay," +
                        "isBreakTask, isPeriodic, DayPeriodicity)" +
                        "VALUES ( null , " +
                        "(SELECT u.IdUser FROM travlendardb.Users AS u WHERE u.eMail = ?), " +
                        "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [user.email, task.name, task.description,
                    task.latitude, task.longitude,
                    task.duration,task.startTime, task.endTime,
                    task.startDay, task.endDay, task.isBreakTask,
                    task.isPeriodic, task.dayPeriodicity],
                function (err, result) {        //TODO check if insertion returns a confirmation msg (result)
                    if(err){
                        msg.err = error_handler.query_error(err);
                        return;
                    }
                    //The query insertion performed successfully
                    msg.status = result;
                    return;
                }
            );
        }
    );
}
let error_handler = require('../../logic/error_handler');

exports.fetch = function addTask(msg, dbRef) {
    let self = this;
    this.msg = msg;

    dbRef.connect(
        function (err) {
            if(err){
                self.msg.err = error_handler.db_connection_error(err);
                return;
            }

            let task = self.msg.task;
            let user = self.msg.user;

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
                        self.msg.err = error_handler.query_error(err);
                        return;
                    }
                    //The query insertion performed successfully
                    self.msg.status = result;
                }
            );
        }
    );
}
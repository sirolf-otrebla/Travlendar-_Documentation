let error_handler = require('../../logic/error_handler');

exports.fetch = function addTask(msg, dbRef, callback) {
    let self = this;
    this.msg = msg;

            let task = self.msg.task;
            let email = self.msg.email;

            dbRef.query("INSERT INTO travlendardb.Tasks( "  +
                        "IdTask, IdUser, Name, Description, " +
                        "Location, Duration, " +
                        "StartTime, EndTime, StartDay, EndDay, " +
                        "isBreakTask, isPeriodic, DayPeriodicity) " +
                        "VALUES ( null, " +
                        "(SELECT u.IdUser FROM travlendardb.Users AS u WHERE u.eMail = ?), " +
                        "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [email, task.name, task.description,
                    task.location,
                    task.duration,task.startTime, task.endTime,
                    task.startDay, task.endDay, task.isBreakTask,
                    task.isPeriodic, task.dayPeriodicity],
                function (err, result) {
                    if(err){
                        self.msg.err = error_handler.query_error(err);
                        callback(self.msg);
                        return;
                    }
                    //The query insertion performed successfully
                    self.msg.status = result;
                    callback(self.msg);
                }
            );
}
exports.fetch = function addTask(msg, dbRef) {
    let task = msg.task;
    dbRef.connect(
        function (err, user, task) {
            if(err){
                msg.err = error_handler.db_connection_error(err);
                return;
            }
            dbRef.query("INSERT INTO travlendardb.Tasks("  +
                "IdTask, IdUser, Name, Description," +
                "Latitude, Longitude, Duration," +
                "StartTime, EndTime, StartDay, EndDay," +
                "isBreakTask, isPeriodic, DayPeriodicity)" +
                "VALUES ( null , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [user, task.name, task.description,
                    task.latitude, task.longitude,
                    task.duration,task.startTime, task.endTime,
                    task.startDay, task.endDay, task.isBreakTask,
                    task.isPeriodic, task.dayPeriodicity],
                function (err, result) {        //TODO check if insertion returns a confirmation msg
                    if(err){
                        msg.err = error_handler.query_error(err);
                        return;
                    }
                    self.user = result;
                    callback();
                }
            );
        }
    );
}
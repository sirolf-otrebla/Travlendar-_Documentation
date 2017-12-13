var error_handler = require('../../logic/error_handler');

exports.fetch = function updateTaskPreferences(msg, dbRef) {

    dbRef.connect(function (err, msg) {
        if(err){
            msg.err = msg.error_handler.db_connection_error(err);
            return;
        }

        var task_preferences = msg.task_preferences;

        //First remove (done by a trigger) and then insert
        dbRef.query("INSERT INTO travlendardb.TasksPreferences( " +
                    "IdTask, TakeCar, TakeBus, TakeCarSharing, TakeBikeSharing, MaxWalk) " +
                    "VALUES (?, ?, ?, ?, ?, ?)",
                [task_preferences.idTask, task_preferences.takeCar, task_preferences.takeBus,
                    task_preferences.takeCarSharing, task_preferences.takeBikeSharing,
                    task_preferences.maxWalk],
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
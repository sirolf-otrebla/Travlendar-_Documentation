let error_handler = require('../../logic/error_handler');

exports.fetch = function updateTaskPreferences(msg, dbRef, callback) {
    let self = this;
    this.msg = msg;

    let task_preferences = self.msg.task_preferences;

    //First remove (done by a trigger) and then insert
    dbRef.query("INSERT INTO travlendardb.TasksPreferences( " +
                "IdTask, TakeCar, TakeBus, TakeCarSharing, TakeBikeSharing, MaxWalk) " +
                "VALUES (?, ?, ?, ?, ?, ?)",
            [task_preferences.idTask, task_preferences.takeCar, task_preferences.takeBus,
                task_preferences.takeCarSharing, task_preferences.takeBikeSharing,
                task_preferences.maxWalk],
            function (err, result) {
                if(err){
                    self.msg.err = error_handler.query_error(err);
                    callback(self.msg);
                    return;
                }
                self.msg.status = result;
                callback(self.msg);
            }
    );
};
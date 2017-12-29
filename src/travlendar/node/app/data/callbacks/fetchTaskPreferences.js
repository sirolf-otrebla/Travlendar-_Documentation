let error_handler = require('../../logic/error_handler');
let db_adapter = require('../../data/database_adapter');

exports.fetch = function getTaskPreferences(msg, dbRef, callback) {
    let self = this;
    this.msg = msg;

        dbRef.query("SELECT * FROM travlendardb.TasksPreferences AS tPref " +
                    "WHERE tPref.IdTask = ?",
                self.msg.taskId,
                function (err, result) {
                    if(err){
                        self.msg.err = error_handler.query_error(err);
                        callback(self.msg);
                        return;
                    }

                    result[0].TakeCar = parse(result[0].TakeCar);
                    result[0].TakeBus = parse(result[0].TakeBus);
                    result[0].TakeCarSharing = parse(result[0].TakeCarSharing);
                    result[0].TakeBikeSharing = parse(result[0].TakeBikeSharing);
                    result[0].HasSeasonTicket = parse(result[0].HasSeasonTicket);

                    self.msg.task_preferences = db_adapter.adaptTaskPreferences(result[0]);
                    callback(self.msg);
                }
            );
}

//Convert from tiny int to boolean value
let parse = function (value) {
    value = !!+value;
    return value;
}
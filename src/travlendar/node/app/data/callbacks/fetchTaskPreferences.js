var error_handler = require('../../logic/error_handler');

exports.fetch = function getTaskPreferences(msg, dbRef) {
    let self = this;
    this.msg = msg;

    dbRef.connect(function (err) {
        if(err){
            self.msg.err = error_handler.db_connection_error(err);
            return;
        }

        dbRef.query("SELECT * FROM travlendardb.TasksPreferences AS tPref " +
                    "WHERE tPref.IdTask = ?",
                self.msg.taskId,
                function (err, result) {
                    if(err){
                        self.msg.err = error_handler.query_error(err);
                        return;
                    }
                    console.log(result);
                    self.msg.taskPref = result;
                }
            );
    });
}
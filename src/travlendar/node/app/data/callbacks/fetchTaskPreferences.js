var error_handler = require('../../logic/error_handler');

exports.fetch = function getTaskPreferences(msg, dbRef) {
    dbRef.connect(function (err, msg) {
        if(err){
            msg.err = error_handler.db_connection_error(err);
            return;
        }

        dbRef.query("SELECT * FROM travlendardb.TasksPreferences AS tPref " +
                    "WHERE tPref.IdTask = ?",
                msg.taskId,
                function (err, result) {
                    if(err){
                        msg.err = error_handler.query_error(err);
                        return;
                    }
                    msg.taskPref = result;
                    return;
                }
            );
    });
}
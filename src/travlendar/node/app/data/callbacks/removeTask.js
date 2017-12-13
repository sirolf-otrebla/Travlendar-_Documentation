var error_handler = require('../../logic/error_handler');

exports.fetch = function removeTask(msg, dbRef) {

    dbRef.connect(
        function (err, msg) {
            if(err){
                msg.err = error_handler.db_connection_error(err);
                return;
            }

            let email = msg.email;
            let idTask = msg.task.idTask;

            dbRef.query("DELETE FROM travlendardb.Tasks " +
                        "WHERE IdTask = ? AND " +
                        "IdUser IN (SELECT u.IdUser FROM " +
                                    "travlendardb.Users AS u " +
                                    "WHERE u.eMail = ?)",
                [idTask, email],
                function (err, result) {
                    if(err){
                        msg.err = error_handler.query_error(err);
                        return;
                    }
                    msg.status = result;
                    return;
                }
            );
        }
    );
}
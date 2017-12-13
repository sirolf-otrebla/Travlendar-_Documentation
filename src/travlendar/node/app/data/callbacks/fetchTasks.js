var error_handler = require('../../logic/error_handler');

exports.fetch = function fetchTasks(msg, dbRef) {

    dbRef.connect(
        function (err, msg) {
            if(err){
                msg.err = error_handler.db_connection_error(err);
                return;
            }
            dbRef.query("SELECT t.* " +
                        "FROM travlendardb.Users AS u INNER JOIN travlendardb.Tasks AS t " +
                        "ON u.IdUser = t.IdUser " +
                        "WHERE u.eMail = ?",
                [msg.email],
                function (err, result) {
                    if(err){
                        msg.err = error_handler.query_error(err);
                        return;
                    }
                    msg.tasks = result;
                    return;
                }
            );
        }
    );

}
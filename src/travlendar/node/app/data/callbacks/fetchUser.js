var error_handler = require('../../logic/error_handler');

exports.fetch = function fetchUser(msg, dbRef) {

    dbRef.connect(
        function (err, msg) {
            if(err){
                msg.err = error_handler.db_connection_error(err);
                return;
            }

            dbRef.query("SELECT * " +
                        "FROM travlendardb.Users AS u " +
                        "WHERE u.eMail = ?",
                [msg.email],
                function (err, result) {
                    if(err){
                        msg.err = error_handler.query_error(err);
                        return;
                    }
                    msg.user = result;
                    return;
                }
            );
        }
    );
}
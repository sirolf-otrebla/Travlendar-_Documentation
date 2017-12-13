var error_handler = require('../../logic/error_handler');

exports.fetch = function getGlobalPreferences(msg, dbRef) {

    dbRef.connect(function (err, msg) {
        if(err){
            msg.err = error_handler.db_connection_error(err);
            return;
        }
        dbRef.query("SELECT * FROM travlendardb.UsersPreferences AS uPref " +
                    "LEFT JOIN travelndardb.Users AS u ON uPref.IdUser = u.IdUser " +
                    "WHERE u.eMail = ?",
                [msg.email],
                function (err, result) {
                    if(err){
                        msg.err = error_handler.query_error(err);
                        return;
                    }
                    msg.global_pref = result;
                    return;
                });
    })
}
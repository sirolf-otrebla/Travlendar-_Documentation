exports.fetch = function fetchUser(msg, dbRef) {
    dbRef.connect(
        function (err, email) {
            if(err){
                msg.err = error_handler.db_connection_error(err);
                return;
            }
            dbRef.query("SELECT u.IdUser, t.* " +
                "FROM travlendardb.Users AS u INNER JOIN travlendardb.Tasks AS t " +
                "ON u.IdUser = t.IdUser WHERE u.eMail = ?",
                email,
                function (err, result) {
                    if(err){
                        msg.err = error_handler.query_error(err);
                        return;
                    }
                    msg.user = result;
                    callback();
                }
            );
        }
    );
}
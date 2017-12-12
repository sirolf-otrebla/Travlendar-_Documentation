exports.fetch = function fetchTasks(msg, dbRef) {
    dbRef.connect(
        function (err, email) {
            if(err){
                msg.err = error_handler.db_connection_error(err);
                return;
            }
            dbRef.query("SELECT * FROM travlendardb.Tasks AS t, travlendardb.Users AS u" +
                "WHERE IdUser = ? ",
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
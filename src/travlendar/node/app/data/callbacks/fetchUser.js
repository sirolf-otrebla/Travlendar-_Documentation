let error_handler = require('../../logic/error_handler');

exports.fetch = function fetchUser(msg, dbRef) {
    let self = this;
    this.msg = msg;

    dbRef.connect(
        function (err) {
            if(err){
                self.msg.err = error_handler.db_connection_error(err);
                return;
            }

            dbRef.query("SELECT * " +
                        "FROM travlendardb.Users AS u " +
                        "WHERE u.eMail = ?",
                [self.msg.email],
                function (err, result) {
                    if(err){
                        console.log(err);
                        self.msg.err = error_handler.query_error(err);
                        return;
                    }
                    console.log(result);
                    self.msg.user = result;
                }
            );
        }
    );
}
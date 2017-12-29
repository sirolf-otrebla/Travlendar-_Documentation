let error_handler = require('../../logic/error_handler');
let db_adapter = require('../../data/database_adapter');

exports.fetch = function fetchUser(msg, dbRef, callback) {
    let self = this;
    this.msg = msg;

/*    dbRef.connect(
        function (err) {
            if(err){
                self.msg.err = error_handler.db_connection_error(err);
                callback(self.msg);
                return;
            }
*/
            dbRef.query("SELECT * " +
                        "FROM travlendardb.Users AS u " +
                        "WHERE u.eMail = ?",
                [self.msg.email],
                function (err, result) {
                    if(err){
                        console.log(err);
                        self.msg.err = error_handler.query_error(err);
                        callback(self.msg);
                        return;
                    }

                    self.msg.user = db_adapter.adaptUser(result[0]);
                    callback(self.msg);
                }
            );
    //    });
};

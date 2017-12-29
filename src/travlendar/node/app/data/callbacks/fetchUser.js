let error_handler = require('../../logic/error_handler');
let db_adapter = require('../../data/database_adapter');

exports.fetch = function fetchUser(msg, dbRef, callback) {
    let self = this;
    this.msg = msg;

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

                    if(result.lenght > 0) {
                        if(result[0].IdUser !== undefined)
                            self.msg.user = db_adapter.adaptUser(result[0]);
                    }
                    callback(self.msg);
                }
            );
};

var error_handler = require('../../logic/error_handler');

exports.fetch = function getGlobalPreferences(msg, dbRef) {
    let self = this;
    this.msg = msg;

    dbRef.connect(function (err) {
        if(err){
            self.msg.err = error_handler.db_connection_error(err);
            return;
        }
        dbRef.query("SELECT uPref.* FROM travlendardb.UsersPreferences AS uPref " +
                    "LEFT JOIN travlendardb.Users AS u ON uPref.IdUser = u.IdUser " +
                    "WHERE u.eMail = ?",
                [self.msg.email],
                function (err, result) {
                    if(err){
                        self.msg.err = error_handler.query_error(err);
                        return;
                    }
                    console.log(result);
                    self.msg.global_pref = result;
                });
    })
}
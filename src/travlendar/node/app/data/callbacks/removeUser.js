let error_handler = require('../../logic/error_handler');

exports.fetch = function removeUser(msg, dbRef, callback) {
    let self = this;
    this.msg = msg;

    let email = self.msg.email;

    dbRef.query("DELETE FROM travlendardb.Users " +
        "WHERE IdUser IN (SELECT u.IdUser " +
                        "FROM (SELECT * FROM travlendardb.Users AS tempUser) u " +
                        "WHERE u.eMail = ?)",
        [email],
        function (err, result) {
            if(err){
                self.msg.err = error_handler.query_error(err);
                callback(self.msg);
                return;
            }
            self.msg.status = result;
            callback(self.msg);
        }
    );
};
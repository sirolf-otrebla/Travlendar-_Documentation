let error_handler = require('../../logic/error_handler');

exports.fetch = function removeTask(msg, dbRef, callback) {
    let self = this;
    this.msg = msg;

            let email = self.msg.email;
            let idTask = self.msg.idTask;

            dbRef.query("DELETE FROM travlendardb.Tasks " +
                        "WHERE IdTask = ? AND " +
                        "IdUser IN (SELECT u.IdUser FROM " +
                                    "travlendardb.Users AS u " +
                                    "WHERE u.eMail = ?)",
                [idTask, email],
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
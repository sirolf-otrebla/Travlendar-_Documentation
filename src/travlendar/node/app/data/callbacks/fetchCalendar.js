var error_handler = require('../../logic/error_handler');

exports.fetch = function getCalendar(msg, dbRef, callback) {
    let self = this;
    this.msg = msg;

        dbRef.query("SELECT cl.*, tr.* " +
                    "FROM travlendardb.calendars AS cl " +
                    "INNER JOIN travlendardb.users AS u " +
                    "ON cl.IdUser = u.IdUser " +
                    "INNER JOIN travlendardb.travels AS tr " +
                    "ON (cl.IdTask = tr.IdStartTask OR cl.IdTask = tr.IdDestinationTask) " +
                    "WHERE u.eMail = ?",
            [self.msg.email],
            function (err, result) {
                if(err){
                    self.msg.err = error_handler.query_error(err);
                    callback(self.msg);
                    return;
                }
                self.msg.calendar = result;
                callback(self.msg);
            }
        );
};
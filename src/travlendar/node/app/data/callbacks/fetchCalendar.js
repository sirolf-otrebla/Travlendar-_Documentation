var error_handler = require('../../logic/error_handler');

exports.fetch = function getCalendar(msg, dbRef) {
    let self = this;
    this.msg = msg;

    dbRef.connect(function (err) {
        if (err){
            self.msg.err = error_handler.db_connection_error(err);
            return;
        }

        dbRef.query("SELECT * FROM travlendardb.Calendars AS c " +
                    "LEFT JOIN travlendardb.Users AS u " +
                    "ON c.IdUser = u.IdUser " +
                    "WHERE u.eMail = ?",
            [self.msg.email],
            function (err, result) {
                if(err){
                    self.msg.err = error_handler.query_error(err);
                    return;
                }
                self.msg.calendar = result;
            }
        );
    })
}
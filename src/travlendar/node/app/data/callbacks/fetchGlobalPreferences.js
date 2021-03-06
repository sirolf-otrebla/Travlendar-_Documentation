let error_handler = require('../../logic/error_handler');

exports.fetch = function getGlobalPreferences(msg, dbRef, callback) {
    let self = this;
    self.callback = callback;
    this.msg = msg;

        dbRef.query("SELECT uPref.* FROM travlendardb.UsersPreferences AS uPref " +
                    "LEFT JOIN travlendardb.Users AS u ON uPref.IdUser = u.IdUser " +
                    "WHERE u.eMail = ?",
                [self.msg.email],
                function (err, result) {
                    if(err){
                        self.msg.err = error_handler.query_error(err);
                        self.callback(self.msg);
                        return;
                    }

                    result[0].TakeCar = parse(result[0].TakeCar);
                    result[0].TakeBus = parse(result[0].TakeBus);
                    result[0].TakeCarSharing = parse(result[0].TakeCarSharing);
                    result[0].TakeBikeSharing = parse(result[0].TakeBikeSharing);
                    result[0].HasSeasonTicket = parse(result[0].HasSeasonTicket);

                    self.msg.global_preferences = result[0];
                    self.callback(self.msg);
                }
        );
}

//Convert from tiny int to boolean value
let parse = function (value) {
    value = !!+value;
    return value;
}
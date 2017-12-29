let error_handler = require('../../logic/error_handler');

exports.fetch = function updateGlobalPreferences(msg, dbRef, callback) {
    let self = this;
    this.msg = msg;

    let global_preferences = self.msg.global_preferences;

    //First remove(done by trigger) and then insert
    dbRef.query("UPDATE travlendardb.UsersPreferences AS uPref " +
                "SET TakeCar = ?, " +
                    "TakeBus = ?, " +
                    "TakeCarSharing = ?, " +
                    "TakeBikeSharing = ?, " +
                    "MaxWalk = ?, " +
                    "HasSeasonTicket = ? " +
                "WHERE uPref.IdUser = (SELECT u.IdUser FROM travlendardb.Users AS u " +
                                        "WHERE u.eMail = ?)",
            [global_preferences.takeCar, global_preferences.takeBus,
                global_preferences.takeCarSharing, global_preferences.takeBikeSharing,
                global_preferences.maxWalk, global_preferences.hasSeasonTicket, self.msg.email,],
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
let error_handler = require('../../logic/error_handler');

exports.fetch = function updateGlobalPreferences(msg, dbRef) {
    let self = this;
    this.msg = msg;

    dbRef.connect(function (err) {
        if(err){
            self.msg.err = error_handler.db_connection_error(err);
            return;
        }

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
                        console.log(err);

                        self.msg.err = error_handler.query_error(err);
                        return;
                    }
                    console.log(result);
                    self.msg.status = result;
                }
            );
    });
}
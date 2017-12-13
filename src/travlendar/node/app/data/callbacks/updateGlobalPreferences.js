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
        dbRef.query("INSERT INTO travlendardb.UsersPreferences( " +
                    "IdUser, TakeCar, TakeBus, TakeCarSharing, TakeBikeSharing, MaxWalk, HasSeasonTicket) " +
                    "VALUES ( (SELECT u.IdUser FROM travlendardb.Users AS u " +
                                    "WHERE u.eMail = ?), ?, ?, ?, ?, ?, ?)",
                [self.msg.email, global_preferences.takeCar, global_preferences.takeBus,
                    global_preferences.takeCarSharing, global_preferences.takeBikeSharing,
                    global_preferences.maxWalk, global_preferences.hasSeasonTicket],
                function (err, result) {
                    if(err){
                        self.msg.err = error_handler.query_error(err);
                        return;
                    }
                    self.msg.status = result;
                }
            );
    });
}
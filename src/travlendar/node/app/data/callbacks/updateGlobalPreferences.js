var error_handler = require('../../logic/error_handler');

exports.fetch = function updateGlobalPreferences(msg, dbRef) {

    dbRef.connect(function (err, msg) {
        if(err){
            msg.err = msg.error_handler.db_connection_error(err);
            return;
        }

        var global_preferences = msg.global_preferences;

        //First remove(done by trigger) and then insert
        dbRef.query("INSERT INTO travlendardb.UsersPreferences( " +
                    "IdUser, TakeCar, TakeBus, TakeCarSharing, TakeBikeSharing, MaxWalk, HasSeasonTicket) " +
                    "VALUES ( (SELECT u.IdUser FROM travlendardb.Users AS u " +
                                    "WHERE u.eMail = ?), ?, ?, ?, ?, ?, ?)",
                [msg.email, global_preferences.takeCar, global_preferences.takeBus,
                    global_preferences.takeCarSharing, global_preferences.takeBikeSharing,
                    global_preferences.maxWalk, global_preferences.hasSeasonTicket],
                function (err, result) {
                    if(err){
                        msg.err = error_handler.query_error(err);
                        return;
                    }
                    msg.status = result;
                    return;
                }
            );
    });
}
let error_handler = require('../../logic/error_handler');

exports.fetch = function fetchTasks(msg, dbRef, callback) {
    let self = this;
    this.msg = msg;

/*    dbRef.connect(function (err) {
            if(err){
                self.msg.err = error_handler.db_connection_error(err);
                callback(self.msg);
                return;
            }
 */
            //Fetch both all the tasks and the relative preferences of the given user
            dbRef.query("SELECT t.*, " +
                        "t_pref.TakeCar, t_pref.TakeBus, t_pref.TakeBikeSharing, t_pref.TakeCarSharing, t_pref.MaxWalk " +
                        "FROM travlendardb.Users AS u INNER JOIN travlendardb.Tasks AS t " +
                        "ON u.IdUser = t.IdUser " +
                        "INNER JOIN travlendardb.taskspreferences AS t_pref " +
                        "ON t.idTask = t_pref.IdTask " +
                        "WHERE u.eMail = ?",
                [self.msg.email],
                function (err, result) {
                    if(err){
                        self.msg.err = error_handler.query_error(err);
                        callback(self.msg);
                        return;
                    }
                    self.msg.tasks = result;
                    callback(self.msg);
                }
            );
    //    });

};
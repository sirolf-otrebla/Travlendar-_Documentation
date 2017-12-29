let error_handler = require('../../logic/error_handler');
let db_adapter = require('../../data/database_adapter');

let whilst = require('async/whilst');

exports.fetch = function fetchTasks(msg, dbRef, callback) {
    let self = this;
    this.msg = msg;
    this.cb = callback;

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
                        self.cb(self.msg);
                        return;
                    }

                    let index = 0;
                    let new_tasks = {};

                    whilst(
                        function (index) {
                            return index <= result.length;
                        },
                        function () {
                            result[index].isBreakTask = parse(result[index].isBreakTask);
                            result[index].isPeriodic = parse(result[index].isPeriodic);

                            result[index].TakeCar = parse(result[index].TakeCar);
                            result[index].TakeBus = parse(result[index].TakeBus);
                            result[index].TakeCarSharing = parse(result[index].TakeCarSharing);
                            result[index].TakeBikeSharing = parse(result[index].TakeBikeSharing);
                            result[index].HasSeasonTicket = parse(result[index].HasSeasonTicket);

                            new_tasks.push(db_adapter.adaptTask(result[index]));
                            index++;
                        },
                        function (err) {
                            self.msg.err = err;
                            self.msg.tasks = new_tasks;
                            self.cb(self.msg);
                        });
                    }
            );

};


//Convert from tiny int to boolean value
let parse = function (value) {
    value = !!+value;
    return value;
}
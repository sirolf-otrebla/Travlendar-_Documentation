let error_handler = require('../../logic/error_handler');

exports.fetch = function addUser(msg, dbRef, callback) {
    let self = this;
    this.msg = msg;

        let user = self.msg.user;

        dbRef.query("INSERT INTO travlendardb.Users( " +
                    "IdUser, eMail, Name, Surname, Password, UserResidence) " +
                    "VALUES (null, ?, ?, ?, ?, ? )",
                [self.msg.email, user.name, user.surname, user.password, user.residence],
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
let error_handeler = require('../../logic/error_handler');

exports.fetch = function addUser(msg, dbRef) {
    let self = this;
    this.msg = msg;

    dbRef.connect(function (err) {
        if(err){
            self.msg.err = error_handeler.db_connection_error(err);
            return;
        }

        let user = self.msg.user;

        dbRef.query("INSERT INTO travlendardb.Users( " +
                    "IdUser, eMail, Name, Surname, Password, UserResidence) " +
                    "VALUES (null, ?, ?, ?, ?, ? )",
                [self.msg.email, user.name, user.surname, user.password, user.residence],
                function (err, result) {
                    if(err){
                        console.log(err);
                        self.msg.err = error_handeler.query_error(err);
                        return;
                    }
                    console.log(result);
                    self.msg.status = result;
                }
            );
    });
}
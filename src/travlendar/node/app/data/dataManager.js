var mysql = require('mysql');

var dbClient = mysql.createConnection({
    host: "localhost",
    user: "travlendarAdmin",
    password: "",
    database: "travlendardb"
});

function fetchUser (userId, callback){
    var self = this;

    this.userId = userId;
    dbClient.connect( function (err, userId) {
        if(err){
            console.log("error on db connection");
            return;
        }
        console.log("fetching user: " + self.userId);
        dbClient.query("SELECT * FROM travlendardb.User WHERE IdUser = ?", self.userId,
            function (err, rows) {
                if(err){
                    console.log("get error!!!");
                    dbClient.end();
                    return;
                }
                console.log(rows);
                for(var i = 0; i < rows.length; i++){
                    console.log("-> User: "+rows[i].Name+" date ("+rows[i].eMail+")");
                }
                callback(null, rows[0]);
                dbClient.end();
            }
        );
    });
};

var id = 2;
console.log("start search.." + id);
fetchUser(id, function (err, result) {
    console.log("obtained -> User: "+result.Name+" date ("+result.eMail+")");
});

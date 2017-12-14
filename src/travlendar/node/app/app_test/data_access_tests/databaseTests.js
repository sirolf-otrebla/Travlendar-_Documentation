let mysql = require('mysql');

let dbRef = mysql.createConnection({
    host: "localhost",
    user: "travlendarAdmin",
    password: "",
    database: "travlendardb"
});

function addUserTest(dbRef){
    let msg = {
        email: "test2User@mail.it",
        user: {
            email: "test2User@mail.it",
            name: "testName",
            surname: "testSurname",
            password: "testPsw",
            residence: "testResidence",
            err: ""
        }
    };

    let fetch_to_test = require('../../data/callbacks/addUser');

    fetch_to_test.fetch(msg, dbRef);

}

function fetchUserTest(dbRef) {
    let msg = {
        email: "test2User@mail.it",
        err: ""
    };

    let fetch_to_test = require('../../data/callbacks/fetchUser');

    fetch_to_test.fetch(msg, dbRef);
}

function fetchGlobalPreferences(dbRef){
    let msg = {
        email: "test2User@mail.it",
        err: ""
    };

    let fetch_to_test = require('../../data/callbacks/fetchGlobalPreferences');

    fetch_to_test.fetch(msg, dbRef);
}

function updateGlobalPreferences(dbRef) {
    let msg = {
        email: "test2User@mail.it",
        global_preferences: {
            takeCar: true,
            takeBus: true,
            takeCarSharing: true,
            takeBikeSharing: false,
            maxWalk: 300,
            hasSeasonTicket: false
        }
    };

    let fetch_to_test = require('../../data/callbacks/updateGlobalPreferences');

    fetch_to_test.fetch(msg, dbRef);

}

//addUserTest(dbRef);

//fetchUserTest(dbRef);

//fetchGlobalPreferences(dbRef);

//updateGlobalPreferences(dbRef);

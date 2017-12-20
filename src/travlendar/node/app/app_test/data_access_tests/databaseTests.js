let sinon = require('sinon');

let chai = require('chai');

let expect = chai.expect;

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
        },
        err: null
    };

    let fetch_to_test = require('../../data/callbacks/addUser');

    fetch_to_test.fetch(msg, dbRef, function (result) {
        expect(result.err).to.equal(null);
        expect(result.status.affectedRows).to.equal(1);
    });

}

function fetchUserTest(dbRef) {
    let msg = {
        email: "test2User@mail.it",
        err: null
    };

    let fetch_to_test = require('../../data/callbacks/fetchUser');

    fetch_to_test.fetch(msg, dbRef, function (msg) {
        if(msg.err){
            console.log("ERROR: " + msg.err);
            expect(msg.err).to.equal(null);
            return;
        }
    });
}

function removeUserTest(dbRef) {
    let msg = {
        email: "test2User@mail.it",
        err: null
    };

    let fetch_to_test = require('../../data/callbacks/removeUser');

    fetch_to_test.fetch(msg, dbRef, function (msg) {
        expect(msg.err).to.equal(null);

    });
}


function fetchGlobalPreferencesTest(dbRef){
    let msg = {
        email: "test2User@mail.it",
        err: null
    };

    let fetch_to_test = require('../../data/callbacks/fetchGlobalPreferences');

    fetch_to_test.fetch(msg, dbRef, function (msg) {
        if(msg.err){
            console.log("ERROR: " + msg.err);
            expect(msg.err).to.equal(null);
            return;
        }
    });
}

function updateGlobalPreferencesTest(dbRef) {
    let msg = {
        email: "test2User@mail.it",
        global_preferences: {
            takeCar: true,
            takeBus: true,
            takeCarSharing: true,
            takeBikeSharing: false,
            maxWalk: 300,
            hasSeasonTicket: false
        },
        err: null
    };

    let fetch_to_test = require('../../data/callbacks/updateGlobalPreferences');

    fetch_to_test.fetch(msg, dbRef, function (msg) {
        if(msg.err){
            console.log("ERROR: " + msg.err);
            expect(msg.err).to.equal(null);
            return;
        }
    });

}

function addTaskTest(dbRef){
    let msg = {
        email: "test2User@mail.it",
        task: {
            name: "testTask",
            description: "task test description",
            latitude: 15.5,
            longitude: 15.5,
            duration: 17,
            startTime: '19:00:00',
            endTime: '23:30:00',
            startDay: '2017-12-24',
            endDay: '2017-12-24',
            isBreakTask: false,
            isPeriodic: false,
            dayPeriodicity: 0
        },
        err: null
    };

    let fetch_to_test = require('../../data/callbacks/addTask');

    fetch_to_test.fetch(msg, dbRef, function (msg) {
        if(msg.err){
            console.log("ERROR: " + msg.err);
            expect(msg.err).to.equal(null);
            return;
        }
    });

}

function fetchTasksTest(dbRef){
    let msg = {
        email: "test2User@mail.it",
        err: null
    };

    let fetch_to_test = require('../../data/callbacks/fetchTasks');

    fetch_to_test.fetch(msg, dbRef, function (msg) {
        if(msg.err){
            console.log("ERROR: " + msg.err);
            expect(msg.err).to.equal(null);
            return;
        }
    });

}

function updateTaskPreferencesTest(dbRef){
    let msg = {
        email: "test2User@mail.it",
        task_preferences: {
            idTask: 1,
            takeCar: true,
            takeBus: true,
            takeCarSharing: true,
            takeBikeSharing: false,
            maxWalk: 50
        },
        err: null
    };

    let fetch_to_test = require('../../data/callbacks/updateTaskPreferences');

    fetch_to_test.fetch(msg, dbRef, function (msg) {
        if(msg.err){
            console.log("ERROR: " + msg.err);
            expect(msg.err).to.equal(null);
            return;
        }
    });

}

function fetchTaskPreferencesTest(dbRef){
    let msg = {
        email: "test2User@mail.it",
        taskId: 1,
        err: null
    };

    let fetch_to_test = require('../../data/callbacks/fetchTaskPreferences');

    fetch_to_test.fetch(msg, dbRef, function (msg) {
        if(msg.err){
            console.log("ERROR: " + msg.err);
            expect(msg.err).to.equal(null);
            return;
        }
    });

}

function removeTaskTest(dbRef){
    let msg = {
        email: "test2User@mail.it",
        idTask: 1,
        err: null
    };

    let fetch_to_test = require('../../data/callbacks/removeTask');

    fetch_to_test.fetch(msg, dbRef, function (msg) {
        if(msg.err){
            console.log("ERROR: " + msg.err);
            expect(msg.err).to.equal(null);
            return;
        }
    });

}

function updateCalendarTest(dbRef){
    let msg = {
        email: "test2User@mail.it",
        scheduled_task: [
            {idTask: 1,
            startDate: '2017-12-24',
            endDate: '2017-12-24',
            startTime: '19:00:00',
            endTime: '23:30:00'},
            {idTask: 2,
            startDate: '2017-12-24',
            endDate: '2017-12-24',
            startTime: '17:00:00',
            endTime: '18:30:00'}
        ],
        travels: {
            idStartTask: 2,
            idDestinationTask: 1,
            startPointLatitude: 15.55,
            startPointLongitude: 15.55,
            endPointLatitude: 15.5,
            endPointLongitude: 15.5,
            transportMean: 'bus',
            duration: 20
        },
        err: null
    };

    let fetch_to_test = require('../../data/callbacks/updateCalendar');

    fetch_to_test.fetch(msg, dbRef, function (msg) {
        if(msg.err){
            console.log("ERROR: " + msg.err);
            expect(msg.err).to.equal(null);
            return;
        }
    });

}

function fetchCalendarTest(dbRef){
    let msg = {
        email: "test2User@mail.it",
        err: null
    };

    let fetch_to_test = require('../../data/callbacks/fetchCalendar');

    fetch_to_test.fetch(msg, dbRef, function (msg) {
        if(msg.err){
            console.log("ERROR: " + msg.err);
            expect(msg.err).to.equal(null);
            return;
        }
    });

}

//addUserTest(dbRef);

//fetchUserTest(dbRef);

//fetchGlobalPreferencesTest(dbRef);

//updateGlobalPreferencesTest(dbRef);

//addTaskTest(dbRef);

//fetchTasksTest(dbRef);

//updateTaskPreferencesTest(dbRef);

//fetchTaskPreferencesTest(dbRef);

//updateCalendarTest(dbRef);

//fetchCalendarTest(dbRef);

//removeTaskTest(dbRef);

//removeUserTest(dbRef);


describe('Database testing', function () {
/*
    it('Remove user', function(done) {
        //TODO check if all the tuples related to the user do not exist anymore(re run the fetch tests)
        removeUserTest(dbRef);
        done();
    });
*/
    it('Add user', function(done) {
        let result = addUserTest(dbRef);
        console.log(result);
        done();
    });
/*
    it('Fetch user', function(done) {
        fetchUserTest(dbRef);
        done();
    });

    it('Fetch global preferences', function(done) {
        fetchGlobalPreferencesTest(dbRef);
        done();
    });

    it('Update global preferences', function(done) {
        updateGlobalPreferencesTest(dbRef);
        done();
    });

    it('Add task', function(done) {
        addTaskTest(dbRef);
        done();
    });

    it('Fetch task', function(done) {
        fetchTasksTest(dbRef);
        done();
    });

    it('Update task preferences', function(done) {
        //TODO check if the tuple exist even before updating it(when the user is created)
        updateTaskPreferencesTest(dbRef);
        done();
    });

    it('Fetch task preferences', function(done) {
        fetchTaskPreferencesTest(dbRef);
        done();
    });

    it('Remove task test', function(done) {
        removeTaskTest(dbRef);
        done();
    });

    it('Remove user', function(done) {
        //TODO check if all the tuples related to the user do not exist anymore(re run the fetch tests)
        removeUserTest(dbRef);
        done();
    });
*/
    }

);

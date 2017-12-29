let sinon = require('sinon');

let expect = require('chai').expect;

let mysql = require('mysql');

let dbRef = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "travlendarAdmin",
    password: "",
    database: "travlendardb"
});

function addUserTest(dbRef, done){
    let msg = {
        email: "test2User@mail.it",
        user: {
            email: "test2User@mail.it",
            name: "testName",
            surname: "testSurname",
            password: "testPsw",
            residence: "testResidence",
        },
        err: ""
    };

    let fetch_to_test = require('../../data/callbacks/addUser');

    fetch_to_test.fetch(msg, dbRef, function (result) {
        if(result.err)
            console.log(result.err.code + " " + result.err.description);
        expect(result.err).to.equal("");
        expect(result.status.affectedRows).to.equal(1);
        done();
    });

}

function fetchUserTest(dbRef, done) {
    let msg = {
        email: "test2User@mail.it",
        err: ""
    };

    let fetch_to_test = require('../../data/callbacks/fetchUser');

    fetch_to_test.fetch(msg, dbRef, function (result) {
        if(result.err){
            console.log("ERROR: " + result.err.code + " " + result.err.description);
        }
        expect(result.err).to.equal("");
        expect(result.user.name).to.equal("testName");
        expect(result.user.surname).to.equal("testSurname");
        expect(result.user.email).to.equal("test2User@mail.it");
        expect(result.user.password).to.equal("testPsw");
        expect(result.user.user_residence).to.equal("testResidence");

        done();
    });
}

function removeUserTest(dbRef, done) {
    let msg = {
        email: "test2User@mail.it",
        err: ""
    };

    let fetch_to_test = require('../../data/callbacks/removeUser');

    fetch_to_test.fetch(msg, dbRef, function (result) {
        if(result.err)
            console.log(result.code + " " + result.description);
        expect(msg.err).to.equal("");
        expect(msg.status.affectedRows).to.equal(1);
        done();
    });
}


function fetchGlobalPreferencesTest(dbRef, done){
    let msg = {
        email: "test2User@mail.it",
        err: ""
    };

    let fetch_to_test = require('../../data/callbacks/fetchGlobalPreferences');

    fetch_to_test.fetch(msg, dbRef, function (result) {
        if(result.err){
            console.log("ERROR: " + result.err);
        }
        expect(result.err).to.equal("");
        let glob_pref = result.global_preferences;

        //Checks the default values for the user preferences
        expect(glob_pref.takeCar).to.equal(false);
        expect(glob_pref.takeBus).to.equal(true);
        expect(glob_pref.takeCarSharing).to.equal(false);
        expect(glob_pref.takeBikeSharing).to.equal(false);
        expect(glob_pref.maxWalk).to.equal(500);
        expect(glob_pref.hasSeasonTicket).to.equal(false);

        done();
    });
}

function updateGlobalPreferencesTest(dbRef, done) {
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
        err: ""
    };

    let fetch_to_test = require('../../data/callbacks/updateGlobalPreferences');

    fetch_to_test.fetch(msg, dbRef, function (result) {
        if(result.err){
            console.log("ERROR: " + result.err.code + " " + result.err.description);
        }
        expect(result.err).to.equal("");
        expect(result.status.affectedRows).to.equal(1);
        done();
    });

}

function addTaskTest(dbRef, done){
    let msg = {
        email: "test2User@mail.it",
        task: {
            name: "testTask",
            description: "task test description",
            location: "temp location address",
            duration: 17,
            startTime: '19:00:00',
            endTime: '23:30:00',
            startDay: '2017-12-24',
            endDay: '2017-12-24',
            isBreakTask: false,
            isPeriodic: false,
            dayPeriodicity: 0
        },
        err: ""
    };

    let fetch_to_test = require('../../data/callbacks/addTask');

    fetch_to_test.fetch(msg, dbRef, function (result) {
        if(result.err){
            console.log("ERROR: " + result.err);
        }
        expect(result.err).to.equal("");
        expect(result.status.affectedRows).to.equal(1);

        done();
    });

}

function fetchTasksTest(dbRef, done){
    let msg = {
        email: "test2User@mail.it",
        err: ""
    };

    let fetch_to_test = require('../../data/callbacks/fetchTasks');

    fetch_to_test.fetch(msg, dbRef, function (result) {
        if(result.err){
            console.log("ERROR: " + result.err);
        }
        console.log(result.tasks);

        expect(result.err).to.equal("");
        expect(result[0].name).to.equal("testTask");
        expect(result[0].description).to.equal("task test description");
        expect(result[0].location).to.equal("temp location address");
        expect(result[0].duration).to.equal(17);
        expect(result[0].startTime).to.equal('19:00:00');
        expect(result[0].endTime).to.equal('23:30:00');
        expect(result[0].startDay).to.equal('2017-12-24');
        expect(result[0].endDay).to.equal('2017-12-24');
        expect(result[0].isBreakTask).to.equal(false);
        expect(result[0].isPeriodic).to.equal(false);
        expect(result[0].dayPeriodicity).to.equal(0);

        done();
    });

}

function updateTaskPreferencesTest(dbRef, done){
    let msg = {
        email: "test2User@mail.it",
        task_preferences: {
            idTask: 12,
            takeCar: true,
            takeBus: true,
            takeCarSharing: true,
            takeBikeSharing: false,
            maxWalk: 50
        },
        err: ""
    };

    let fetch_to_test = require('../../data/callbacks/updateTaskPreferences');

    fetch_to_test.fetch(msg, dbRef, function (result) {
        if(result.err){
            console.log("ERROR: " + result.err.code + " " + result.err.description);
        }
        expect(result.err).to.equal("");
        done();
    });

}

function fetchTaskPreferencesTest(dbRef, done){
    let msg = {
        email: "test2User@mail.it",
        taskId: 1,
        err: ""
    };

    let fetch_to_test = require('../../data/callbacks/fetchTaskPreferences');

    fetch_to_test.fetch(msg, dbRef, function (result) {
        if(result.err){
            console.log("ERROR: " + result.err);
        }
        expect(result.err).to.equal("");
        done();
    });

}

function removeTaskTest(dbRef, done){
    let msg = {
        email: "test2User@mail.it",
        idTask: 1,
        err: ""
    };

    let fetch_to_test = require('../../data/callbacks/removeTask');

    fetch_to_test.fetch(msg, dbRef, function (result) {
        if(result.err){
            console.log("ERROR: " + result.err);
        }
        expect(result.err).to.equal("");
        done();
    });

}

function updateCalendarTest(dbRef, done){
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
        err: ""
    };

    let fetch_to_test = require('../../data/callbacks/updateCalendar');

    fetch_to_test.fetch(msg, dbRef, function (result) {
        if(result.err){
            console.log("ERROR: " + result.err);
        }
        expect(result.err).to.equal("");
        done();
    });

}

function fetchCalendarTest(dbRef, done){
    let msg = {
        email: "test2User@mail.it",
        err: ""
    };

    let fetch_to_test = require('../../data/callbacks/fetchCalendar');

    fetch_to_test.fetch(msg, dbRef, function (result) {
        if(result.err){
            console.log("ERROR: " + result.err);
        }
        expect(result.err).to.equal("");
        done();
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

    it('Remove user', function(done) {
        //TODO check if all the tuples related to the user do not exist anymore(re run the fetch tests)
        //removeUserTest(dbRef, done);
        done();
    });

    it('Add user', function(done) {
        addUserTest(dbRef, done);
    });

    it('Fetch user', function(done) {
        fetchUserTest(dbRef, done);
    });

    it('Fetch global preferences', function(done) {
        fetchGlobalPreferencesTest(dbRef, done);
    });

    it('Update global preferences', function(done) {
        updateGlobalPreferencesTest(dbRef, done);
    });

    it('Add task', function(done) {
        addTaskTest(dbRef, done);
    });

    it('Fetch task', function(done) {
        fetchTasksTest(dbRef, done);
    });

    it('Update task preferences', function(done) {
        //TODO check if the tuple exist even before updating it(when the user is created)
        updateTaskPreferencesTest(dbRef, done);
    });

    it('Fetch task preferences', function(done) {
        fetchTaskPreferencesTest(dbRef, done);
    });

    it('Remove task test', function(done) {
        removeTaskTest(dbRef, done);
    });

    it('Remove user and check the db is clean', function(done) {
        //TODO check if all the tuples related to the user do not exist anymore(re run the fetch tests)
        removeUserTest(dbRef, done);
    });

    }

);

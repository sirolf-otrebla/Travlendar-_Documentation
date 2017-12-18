let async = require('async');

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
        err: ""
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

function removeUserTest(dbRef) {
    let msg = {
        email: "test2User@mail.it",
        err: ""
    };

    let fetch_to_test = require('../../data/callbacks/removeUser');

    fetch_to_test.fetch(msg, dbRef);
}


function fetchGlobalPreferencesTest(dbRef){
    let msg = {
        email: "test2User@mail.it",
        err: ""
    };

    let fetch_to_test = require('../../data/callbacks/fetchGlobalPreferences');

    fetch_to_test.fetch(msg, dbRef);
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
        err: ""
    };

    let fetch_to_test = require('../../data/callbacks/updateGlobalPreferences');

    fetch_to_test.fetch(msg, dbRef);

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
        err: ""
    };

    let fetch_to_test = require('../../data/callbacks/addTask');

    fetch_to_test.fetch(msg, dbRef);

}

function fetchTasksTest(dbRef){
    let msg = {
        email: "test2User@mail.it",
        err: ""
    };

    let fetch_to_test = require('../../data/callbacks/fetchTasks');

    fetch_to_test.fetch(msg, dbRef);

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
        err: ""
    };

    let fetch_to_test = require('../../data/callbacks/updateTaskPreferences');

    fetch_to_test.fetch(msg, dbRef);

}

function fetchTaskPreferencesTest(dbRef){
    let msg = {
        email: "test2User@mail.it",
        taskId: 1,
        err: ""
    };

    let fetch_to_test = require('../../data/callbacks/fetchTaskPreferences');

    fetch_to_test.fetch(msg, dbRef);

}

function removeTaskTest(dbRef){
    let msg = {
        email: "test2User@mail.it",
        idTask: 1,
        err: ""
    };

    let fetch_to_test = require('../../data/callbacks/removeTask');

    fetch_to_test.fetch(msg, dbRef);

}

function updateCalendarTest(dbRef){
    let msg = {
        email: "test2User@mail.it",
        scheduled_task: {
            idTask: 1,
            startDate: '2017-12-24',
            endDate: '2017-12-24',
            startTime: '19:00:00',
            endTime: '23:30:00'
        },
        err: ""
    };

    let fetch_to_test = require('../../data/callbacks/updateCalendar');

    fetch_to_test.fetch(msg, dbRef);

}

function fetchCalendarTest(dbRef){
    let msg = {
        email: "test2User@mail.it",
        err: ""
    };

    let fetch_to_test = require('../../data/callbacks/fetchCalendar');

    fetch_to_test.fetch(msg, dbRef);

}

//addUserTest(dbRef);

//fetchUserTest(dbRef);

//fetchGlobalPreferencesTest(dbRef);

//updateGlobalPreferencesTest(dbRef);

//addTaskTest(dbRef);

//fetchTasksTest(dbRef);

//updateTaskPreferencesTest(dbRef);

//fetchTaskPreferencesTest(dbRef);

//removeTaskTest(dbRef);

//updateCalendarTest(dbRef);

//fetchCalendarTest(dbRef);

//removeUserTest(dbRef);
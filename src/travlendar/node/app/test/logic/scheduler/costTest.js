let sinon = require('sinon');
let expect = require('chai').expect;
let entities = require('../../../logic/entities');
let evaluator = require('../../../logic/scheduler/cost');

function buildSchedule() {
    let schedule = {
        tasks: [],
        travels: []
    };

    let preference = new entities.TaskPreferences(true, true, true, false, 100);

    schedule.tasks.push(new entities.Task( 1, 1, "testTask1", "", "Buccinasco, Via Lario, 3", 20,
                                           "08:00:00", "08:20:00", "2017-12-24", "2017-12-24", false,
                                            false, 0, preference));
    schedule.tasks.push(new entities.Task(  2, 1, "testTask2", "", "Buccinasco, Via Primo Maggio, 8", 30,
                                            "09:00:00", "09:30:00", "2017-12-24", "2017-12-24", false,
                                            false, 0, preference));
    schedule.tasks.push(new entities.Task(  3, 1, "testTask3", "", "Buccinasco, Via Papa Giovanni XXIII, 15", 30,
                                            "10:00:00", "10:30:00", "2017-12-24", "2017-12-24", false,
                                            false, 0, preference));

    /* startTask, endTask, transport */
    schedule.travels.push(new entities.Travel(schedule.tasks[0], schedule.tasks[1], entities.travelMeans.driving));
    schedule.travels.push(new entities.Travel(schedule.tasks[1], schedule.tasks[2], entities.travelMeans.driving));

    return schedule;
}

describe('Cost evaluation testing', function () {
    it('Should eval an entire schedule', function (done) {
        let schedule = buildSchedule();
            evaluator.completeScheduleEval(schedule, function (result) {
                console.log("The computed cost is: " + result);
                done();
            });
    });
} );

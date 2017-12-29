exports.schedule = function (tasks, callback) {
    let weekScheduler = require("week");
    let dayScheduler = require("day");
    let week = weekScheduler.schedule(tasks);
    week.forEach((d) => {

    });

}
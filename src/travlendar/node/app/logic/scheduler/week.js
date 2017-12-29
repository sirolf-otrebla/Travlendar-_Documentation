const BETA = 1;
const GAMMA = 1;
const DAY_MS = 86400000;
import WeekDay from "sched_entities";
/** schedule main function
 *
  */
exports.schedule = function (tasks) {
    let dividedTask = split(tasks);
    let week = buildWeek();
    scheduleFixed(week, dividedTask.fixed);
    scheduleFlexible(week, dividedTask.flexible);
    scheduleVariable(week,dividedTask.variable);
    return week;
}
let scheduleFixed = function ( week,tasks) {
    tasks.forEach((t) => {
        week.forEach((w) => {
            if(t.timeSlot.start > w.time && t.timeSlot < (w.time + DAY_MS) ){
                w.addTask(t);
            }
        })
    })
};

let scheduleFlexible = function ( week,tasks) {
    tasks.forEach((t) => {
        week.forEach((w) => {
            if(t.timeSlot.start > w.time && t.timeSlot < (w.time + DAY_MS) ){
                w.addTask(t);
            }
        })
    })
};

let buildWeek = function () {
    const WEEK_DURATION = 7
    let week = [];
    let now = new Date(Date.now());
    let firstDay = new Date(now);
    firstDay.setDate(now.getDate() + 1);
    firstDay.setHours(0,0,0,0);
    for(let i = 0, thisDay = new Date(firstDay); i < 7; i++){
        thisDay.setDate(thisDay.getDate() + 1);
        week.push(new WeekDay(thisDay.getTime()));
    }
    return week;
};

let scheduleVariable = function (week, tasks) {
    for(i = 0; i < 7; i++){
        week[i] = new weekDay();
    }
    tasks.forEach((task) => {
        let accumulator = 0;
        week.forEach((wd) => {
            wd.lowerBound = accumulator;
            accumulator += wd.prb(task, week);
            wd.upperBound = accumulator;
        } );

        let rand = Math.random();
        for ( i = 0; i < week.length ; i++) {
            if (week[i].upperBound > rand && week[i].lowerBound <= rand){
                wd.addTask(task);
            }
            break;
        }
    });

};

let split = function (tasks) {

    let fixed = [];
    let flexible = [];
    let variable = [];
    let ent = require('../entities');
    tasks.forEach((t) => {
        //TODO REVIEW THIS
        if (t instanceof ent.FixedTask){
            fixed.push(t);
        }
    });
    tasks.forEach((t) => {
        //TODO REVIEW THIS
        if (t instanceof ent.FlexibleTask){
            flexible.push(t);
        }
    });
    tasks.forEach((t) => {
        //TODO REVIEW THIS
        if (!( flexible.includes(t) ||fixed.includes(t))){
            variable.push(t);
        }
    });
    let res = {
        variable : variable,
        fixed : fixed,
        flexible : flexible
    }

    return res;
}


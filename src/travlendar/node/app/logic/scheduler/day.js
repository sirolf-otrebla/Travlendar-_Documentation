import * as ent from "../entities";

const INF = -1;
const TRANSPORTS = 3;
import DaySchedule from 'sched_entities';
import {Travel} from "../entities";

// must have home as first and last task of the queue;
// it is possible to consider as first bound a greedy approach;
exports.schedule = function (tasks, day) {

};
/**
 *
 * @param tasks { fixed
 *                flexible
 *                variable
 *                }
 * @param callbacks  = { flexible => callback for flexible scheduling
 *                       BnB => callback for Branch and Bound
 *                       end => ending callback
 *                   }
 */
scheduleFixed = function(tasks, upper_callback){
    if (tasks.variable.length === 0 && tasks.flexible === 0){
        let cost = require('cost');
        let schedule = {
            tasks : [],
            travels : [],
            next_increment: 0,
            cost : 0,
        };
        // TODO NEEDS DUMMY INIT AND ENDING TASK
        let genInitSched = function (fixed, schedule, defaultTransport) {
            for (let i = 1 ; i < fixed.length; i++){
                schedule.tasks.push(fixed[i]);
                schedule.travels.push(new Travel(fixed[i-1], fixed[i], defaultTransport));
            }
        } ;
        let initEvalLoop = function (index, schedule, increment, callback) {
            if (index < fixed.length){
                cost.scheduleEval(schedule.slice(0,index +1), (res) => {
                    initEvalLoop(index+1, schedule, res, callback);
                })
            } else {
                callback(increment, schedule);
            }
        };

        let fixedBranchNBound = function(cost, schedule){
            let bound = cost;
            let bestSchedule = new DaySchedule();
            schedule.travels.forEach((t) => {
                bestSchedule.addTravel(t);
            });

            let workingLoop = function (upper_counter, callback) {
                if (upper_counter > 0) {

                    let choices = [];
                    let actualSchedule = new DaySchedule();
                    bestSchedule.travels.slice(0, upper_counter).forEach(
                        (travel) => {
                            actualSchedule.addTravel(travel);
                        }
                    );
                    let subTreeWorkingLoop = function (lower_counter, actualSchedule) {
                        if (lower_counter + upper_counter < bestSchedule.travels.length ||
                            choices.length > 0) {
                            bestSchedule.tasks[lower_counter].allowedTransports().forEach(
                                (transport) => {
                                    choices.push(transport);
                                }
                            );
                            let chosenIndex = selectRandomIndex(0, choices.length);
                            let chosenElement = choices[chosenIndex];
                            let newTravel = new Travel(
                                bestSchedule.tasks[lower_counter - 1],
                                bestSchedule.tasks[lower_counter],
                                chosenElement);
                            choices = [];
                            actualSchedule.addTravel(newTravel);
                            actualSchedule.incrementCost((actualSchedule) => {
                                if (actualSchedule.cost() < bound) {
                                    subTreeWorkingLoop(lower_counter + 1, actualSchedule);
                                }
                                else {
                                    actualSchedule.removeLastTravel();
                                    actualSchedule.decrementCost();
                                }
                            })
                        } else {
                            if (actualSchedule.cost < bound) {
                                bound = actualSchedule.cost;
                                bestSchedule = actualSchedule;
                            }
                        }
                    }
                    workingLoop(upper_counter -1);
                } else {
                    callback(bestSchedule, cost);
                }
            }

            workingLoop(schedule.travels.length - 3, (schedule, cost) => {
                upper_callback(schedule);
                //TODO VERIFY
            });


        }
        genInitSched(tasks.fixed, schedule, "TRANSIT");
        initEvalLoop(0,schedule,0, fixedBranchNBound);
};
/**
 *
 * @param flexible
 * @param freeTimeSlots
 * @param callback  {
 *                       BnB => callback for Branch and Bound
 *                       end => ending callback
 *                   }
 */
scheduleFlexible = function (flexible, freeTimeSlots, callback) {
    if (flexible.length === 0 ){
        callback.BnB(end)

    }
    let timeSlotsFlexibleTasks = [];
    flexible.sort((f1, f2) => {
        return f1.duration - f2.duration;
    });

    flexible.forEach((task) => {
        for (let index = 0; index < freeTimeslots.length; index++){
            if (isFlexibleTaskCompliant( freeTimeslots[0], task, timeSlotsFlexibleTasks[index])){
                timeSlotsFlexibleTasks.push(task);
                break;
            }
        }
    });

};

scheduleVariable = function (tasks, callback) {

};
isFlexibleTaskCompliant = function(timeslot, flexibleTask, others){
    let checkOthers = function (others, slot, flexible) {
        let duration = timeslot.end - timeslot.start;
        let acc = flexible.duration;
        others.forEach((f) => {
            acc =+ f.duration;
        });
        if (acc > duration){
            return false;
        }
    };

    if (timeslot.start > flexibleTask.timeslot.start){
        return false;
    }
    if (flexibleTask.timeslot.start > timeslot.start
        && flexibleTask.timeslot.end < timeslot.end){
        return checkOthers(others, timeslot, flexibleTask)

    }
    if (flexibleTask.timeSlot.start > timeslot.start
        && flexibleTask.timeslot.end > timeslot.end){
        if(flexibleTask.duration < timeslot.end - timeslot.start){
            return checkOthers(others, timeslot, flexibleTask);
        } else {
            return false;
        }
    }
    return false;
};
checkFreeTimeSlots = function (fixed) {
    let occupiedTimeSlots = [];                                                 // time slots occupied by fixed tasks
    let freeTimeSlots = [];                                                     // free time slots between fixed tasks
    let entities = require('../entities');
    fixed.forEach((t) => {                                                      // populating occupied timeslots
        occupiedTimeSlots.push(t.timeSlot);
    });
    occupiedTimeSlots.sort((t1, t2) => {                                        // ordering time slots
        return t2.start - t1.start;
    });
    let res = checkOverlappings(occupiedTimeSlots);                             // check there are not overlapping time slots
    if (res.flag === true){
        //TODO ERROR
    }else {
        occupiedTimeSlots.forEach((t, i, arr) => {
            freeTimeSlots.push(new entities.Timeslot(t.end, arr[i + 1].start));
        } );
        return freeTimeSlots;
    }
}
scheduleFlexible = function (flexible, freeTimeSlots) {
    let couples = [];
    for (let i = 0; i < flexible.length; i++){
        for(let j = 0; j < freeTimeSlots.length; j++){
            if (flexible[i].containedIn(freeTimeSlots[j])){
                let c = {
                    task : flexible[i],
                    timeSlot : freeTimeSlots[j]
                };
                couples.push(c);
                break;
            }
        }
    }
    let timeslots = [];
    couples.forEach((c) => {

    })


};

branchNBound = function (start, end, others, defaultTransport, endCallback) {
    let ent = require('../entities');                                           // where to take business entities
    let bound = INF;                                                            // actual bound in BnB algorithm
    let bestSchedule = null;                                                    // actual best schedule found
    let working = true;                                                         // flag for main algorithm loop

    let upper_counter = 0;                                                      // root of analyzed subtree
    let lower_counter = 0;                                                      // subtree level being analyzed
    tasks = others;
    if (tasks.length === 0 ){
        let choices = [];
        end.allowedTransports.forEach((tm) =>  {                                // each choice is a JSON object relative to a travel, with references
            choices.push({                                                      // to the arrival and to the travel mean
                mean : tm,
                task : end
            });
        });
        let best = {
            cost : Infinity,
            schedule : null,
        }
        let checkBestTravel = function (index, best) {
            let cost = require('cost');
            let schedule = {
                tasks : [ start, end],
                travels : [ choices[index] ],
                next_increment : 0
            };
            cost.scheduleEval(schedule, (cost) => {
                if (index < choices.length){
                    if (cost < best.cost ){
                        best.schedule = new DaySchedule();
                        best.schedule.addTravel(
                            new ent.Travel( start,
                                choices[index].task,
                                choices[index].mean)
                        );
                        checkBestTravel(index+1, cost);
                    }
                    checkBestTravel(index+1, best);
                }
                else{
                    endCallback(best.schedule);

                }
            })
        }


    }
        while (working){
        if (bound === INF) {                                                    // algorithm first step
            let init = generateInitSched(start, tasks, defaultTransport);              // generate a greedy solution (need a default travel mean)
            bestSchedule = new DaySchedule();                                   // create new schedule for the newly generated sol
            init.forEach((t) => {                                               // populate bestschedule
                bestSchedule.addTravel(t);
            });
            upper_counter = bestSchedule.taskList.length - 3;                   // update upper counter so that the root is 2 levels higher than the bottom of the list
                                                                                // in this way upper counter is set for the first iteration of the main loop.
            bound = init.bound;                                                 // set the bound as the newly generated schedule's cost

        } else {                                                                // second or higher loop iterations
            let choices = [];                                                   // this array will contain the possible choices amongst travels
            let taskChoices = bestSchedule.taskList.slice(                      // copy the input in another array so it can modified without side effects
                upper_counter, bestSchedule.taskList.length);
            let actualSchedule = new DaySchedule();                             // generate a new DaySchedule representing the actual partial result
            bestSchedule.travelList.slice(0, upper_counter).forEach(            // populate the new schedule with every element
                (t) => {                                                        // having index lower than the upper counter
                    actualSchedule.addTravel(t);
                }
            );
            taskChoices.forEach((t) => {                                        // for each task that can be chosen we generate a set of possible choices
                t.allowedTransports.forEach((tm) =>  {                          // each choice is a JSON object relative to a travel, with references
                    choices.push({                                              // to the arrival and to the travel mean
                        mean : tm,
                        task : t
                    });
                });
            });

            while (lower_counter + upper_counter <                              // while there are possible choices OR
                        bestSchedule.taskList.length ||                         // the actual solution is not complete (it means that every task as an associated
                        choices.length > 0){                                    // travel within the actual solution (and so exists an order between tasks))

                let chosenIndex = selectRandomIndex(0, choices.length);         // chose an index indicating the chosen choice

                let lastTask = actualSchedule.taskList.pop();                   // saves the last task in the solution popping it and then pushing it back
                actualSchedule.taskList.push(lastTask);                         // it is necessary in order to build the "real" travel object, that needs both starting and ending tasks

                let chosenElement = choices[chosenIndex];                       // extract the chosen element from the array
                choices.splice(chosenIndex);                                    // remove the choice from the array

                actualSchedule.addTravel(                                       // build the 'real' travel object and adds it to the schedule object
                    new ent.Travel( lastTask,
                                    chosenElement.task,
                                    chosenElement.mean)
                )
                ;
                //  TODO : WRONG, THE NEW COST IS NOT CONTAINED WITHIN ACTUALSCHEDULE
                                                                                // now we assume (IT IS WRONG, WEE NEED TO CHANGE IT) that the new cost is already present in Schedule object
                if (actualSchedule.cost < bound){                               // if the new cost is lower than the bound :

                    choices.forEach((c)=> {                                     // we remove each choice built for the same task!
                        if( c.task === chosenElement.task)
                            choices.splice(choices.indexOf(c));
                    });
                    lower_counter++;                                            // and them we increment the lower counter so that
                                                                                // it is possible to add more tasks in the next iteration
                } else{
                    actualSchedule.removeLastTravel();                          // if the new cost is lower we need to remove the last travel we added
                                                                                // schedule deals with removing the last travel's cost
                }
            }                                                                   // we're exiting from the cycle that produces a solution

            if(actualSchedule.taskList.length < tasks.length){                  // if not every tasks has been assigned:
                                                                                // it means that every branch in the subtree is worse than the bound,
                                                                                // but it can also means that something went wrong, so whe have to check it out
                //TODO ;
            }

            if (actualSchedule.cost < bestSchedule.cost){                       // if the actual schedule is better than the bound
                bestSchedule = actualSchedule;                                  // we replace the bound with it
            }
            upper_counter--;                                                    // we decrement the upper counter so we can explore a wider subtree

            if (upper_counter < 0){                                             // if upper counter is lesser than zero:
                working = false;                                                // the algorithm is over and we have our best solution inside bestSchedule object
            }
        }

    }

    return bestSchedule;

};


generateInitSched = function (start, tasks, defaultTransport) {
    let ent = require('../entities');
    let startingSol = [];
    let completed = true;
    let t = start;
    let arr = tasks.slice(0, tasks.length);
    for (let counter = 0 ; counter < tasks.length; counter++){
        let dist = INF;
        let best = null;
        arr.forEach((t2) => {
            if (dist === INF) {
                dist = distance(t.location, t2.location);
            }
            if(distance(t.location, t2.location) < dist){
                dist = distance(t.location, t2.location);
                best = t2;
            }
        });
        startingSol.push(best);
        arr.splice(arr.indexOf(best));
        t = best
    }
    let startSched = new DaySchedule();
    for (let i = 0; i < startingSol.length - 1; i++){
        startSched.addTravel( new ent.Travel (
            startingSol[i],
            startingSol[i+1],
            defaultTransport ));
    };
    return {
            sched : startSched,
            bound : startSched.cost
        }
};


selectRandomIndex = function (startingIndex, elements) {
    let getRandomArbitrary = function(min, max) {
        return Math.random() * (max - min) + min;
    }
    return startingIndex + getRandomArbitrary(0, elements);
};

checkOverlappings = function(TimeSlots){
    let overlapping = [];
    for(let i = 0; i < TimeSlots.length; i++) {
       let thisOverlapped = [];
        for (let j = i; i < TimeSlots.length - i; j++) {

            if (TimeSlots[j].start > TimeSlots[i].end) {
                break;
            }
            else {
                thisOverlapped.push({
                    First: TimeSlots[i],
                    Second: TimeSlots[j]
                });
            }

        }
        if (thisOverlapped.length > 0 ){
            overlapping.push(thisOverlapped);
        }
    }
    let res = {
        overlappingList : overlapping,
        flag : false
    };

    if (overlapping.length > 0){
        res.flag = true;
    }
    return res;

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
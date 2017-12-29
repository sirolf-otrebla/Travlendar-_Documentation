import * as ent from "../entities";

const INF = -1;
const TRANSPORTS = 3;
import DaySchedule from 'sched_entities';
import {Travel} from "../entities";

// must have home as first and last task of the queue;
// it is possible to consider as first bound a greedy approach;
exports.schedule = function (tasks, day, cb) {
    if (tasks.variable.length === 0 && tasks.flexible === 0) {
        let cost = require('./cost');
        scheduleFixed(tasks, cost, cb);
    }
};
/** this function object builds an optimal fixed task - only schedule.
 *
 * @param fixed - is an object containing all fixed tasks
 * @param costEvaluator - is an object used to calculate task costs. it is passed as parameter in order to improve modularity.
 * @param upper_callback - callback executed at algorithm's ending. The algorithm is supposed to be non blocking (?)
 */
scheduleFixed = function(fixed, costEvaluator, upper_callback) {

    let costCalculator = costEvaluator;                                                         // we use this variable inside the inner functions
    let schedule = {                                                                            // here we define a raw schedule object that is meant
        tasks: [],                                                                              // to be used in order to generate a initial schedule
        travels: [],                                                                            // this initial schedule provides the first bound for our
        next_increment: 0,                                                                      // algorithm
        cost: 0
    };                                                                                          // the following TO DO is an important reminder

    // ---------------------------- A U X I L I A R Y   I N N E R   F U N C T I O N S   D E F S --------------------------------------------------

    // TODO NEEDS DUMMY INIT AND ENDING TASK inside the fixed task list
    let genInitSched = function (fixed, schedule, defaultTransport) {                           // this function generates an initial schedule
        for (let i = 1; i < fixed.length; i++) {                                                // for each task we want to:
            schedule.tasks.push(fixed[i]);                                                      // insert it in the schedule object
            schedule.travels.push(new Travel(fixed[i - 1], fixed[i], defaultTransport));        // build a proper travel between that task and the one preceding it
        }
    };
    let initEvalLoop = function (index, schedule, cost, callback) {                             // this function provides an evaluation of the overall init schedule's cost
        if (index <= schedule.travels.length) {                                                 // loop condition : we have to shift both travel and task lists within schedule
            let thisCycleSchedule = {                                                           // we define another schedule object that is going to be passed as argument for eval
                tasks : schedule.tasks.slice(0, index),                                         // in the next iteration. we can fill tasks from 0 to index, such that
                travels : [],                                                                   // every iteration pushes another element within the schedule. that last element will
            };
            if (index !== schedule.travels.length ){                                            // the travel list is shorter than the task list by one element, so we have to check
                thisCycleSchedule.travels = schedule.travels.slice(0, index);                   // the index before pushing any travels inside the schedule. if the index is equal
            }                                                                                   // to list's length then all travels have been coherently pushed

            cost.scheduleEval(thisCycleSchedule, (res) => {                                     // we now evaluate the increment given by the last travel. the res parameter is then
                                                                                                // that increment. this is an asynchronous computation an thus needs a callback
                initEvalLoop(index + 1, schedule, res + cost, callback);                        // we call recursively the loop inside the callback, incrementing index and pushing the increment
                                                                                                // inside the argument.
            })
        } else {                                                                                // if the loop is finished
            callback(cost, schedule);                                                           // we call this function's callback, passing as result the cost and the raw schedule object
        }                                                                                       // the callback will then parse that raw object transforming it into a more functional
    };                                                                                          // instance of DaySchedule class.

    /**
     *
     * @param cost - this parameter has to be the current bound (see how branch and bound algorithm works
     * @param schedule  - this parameter has to be the initial schedule, which will be used in order to build
     *        the optimal solution.
     */
    let fixedBranchNBound = function (cost, schedule) {                                         // this function implements a branch and bound algorithm for fixed task scheduling
        let bestSchedule = new DaySchedule();                                                   // we want to build (and use) a DaySchedule instance, so we create one for the bound
        let bound = cost;                                                                       // because of implementation details, we cannot store the bound cost inside the
                                                                                                //      best schedule object, then we create a variable devoted to this.

        schedule.travels.forEach((t) => {                                                       // we then populate the newly created object
            bestSchedule.addTravel(t);                                                          // using travels contained in the raw object passed as argument
        });
                                                                                                // we then define some (asynchronous) loops

        // =========================  I N N E R   R E C U R S I V E   L O O P S   F U N C T I O N S ======================================================================

        /**
         * this is the main algorithm's loop, it has work only inside the parent function.
         * it relies on variables that are defined outside this function (e. g. inside the parent function)
         * these variables cannot be defined inside the function cause of the recursive nature of it, and
         * are so treated ad "static" variables. passing them as arguments will be redundant.
         * @param upper_counter  - this arguments serves as cycle counter, it represents the level
         *                         at with the branch and bound tree is
         *                         split before starting subtree exploration.
         * @param callback       - this argument represents the latter callback, which will be
         *                         called by the loop at the end of the exploration.
         */
        let workingLoop = function (upper_counter, callback) {                                   // this is the main algorithm's loop, which works recursively
            if (upper_counter > 0) {                                                             // this condition states that we are exploring a BnB subtree
                                                                                                 // and we are not before the tree root ( e .g . we are exploring within
                                                                                                 // the travel list.  on the left of upper_counter, we maintain the
                                                                                                 // schedule, on the right we explore possible alternatives.

                let choices = [];                                                                // this array will contain the possible choices for each recursion step
                let actualSchedule = new DaySchedule();                                          // we want to define a schedule representing the branch we are exploring
                let lower_counter = 0;                                                           // this is the index defining the exploration depth of the subtree
                bestSchedule.travels.slice(0, upper_counter).forEach(                            // we push all travels  that are on the left of the
                    (travel) => {                                                                // upper_counter, without calculating the cost
                        actualSchedule.addTravel(travel);                                        // that's because we will do it later, outside the loop
                    }
                );

                bestSchedule.tasks[upper_counter+ lower_counter].allowedTransports().forEach(    // we populate the choices list defined before with all possible
                    (transport) => {                                                             // transport means for the next task ( remember that tasks are fixed an so is
                        choices.push(transport);                                                 // their sequence, so all possible choices are only regarding transport means
                    }
                );


                let subTreeWorkingLoop = function (actualSchedule) {                             // this function represents the loop that explores the current subtree branch
                    if (lower_counter + upper_counter < bestSchedule.travels.length ||           // loop condition, if we have not explored the branch and bound tree
                        choices.length > 0) {                                                    // in all its depth

                        let chosenIndex = selectRandomIndex(0, choices.length);                  // we then select a random index in order to chose an element from choices list
                        let chosenElement = choices[chosenIndex];                                // we extract that element
                        let newTravel = new Travel(                                              // we build a travel using our information regarding the selected
                            bestSchedule.tasks[lower_counter - 1],                               // travel mean and the two tasks involved ( which are selected by using
                            bestSchedule.tasks[lower_counter],                                   // the lower counter)
                            chosenElement);
                        choices.splice(chosenIndex);                                             // we clear the choices list from the chosen object
                        actualSchedule.addTravel(newTravel);                                     // we add the new travel to the actual schedule list
                        actualSchedule.incrementCost(costCalculator, (actualSchedule) => {       // and then we increment cost. this call is asynchronous, so we need a callback
                            if (actualSchedule.cost() < bound) {                                 //     WHITHIN THE CALLBACK: if the actual cost is higher than the bound:
                                subTreeWorkingLoop(lower_counter + 1, actualSchedule);           //         we proceed for another iteration
                            }
                            else {                                                               //     else:
                                actualSchedule.removeLastTravel();                               //         we clean the actualschedule from the last travel
                                actualSchedule.decrementCost();                                  //         we restore the cost
                                subTreeWorkingLoop(lower_counter, actualSchedule);               //         and then we call another loop iteration with the same arguments.
                            }
                        })
                    } else {                                                                     // if the loop condition is not satisfied it means that we have explored
                                                                                                 // the branch in all of its depth.
                        if (actualSchedule.cost < bound) {                                       // if the actual schedule is better than the bound,
                            bound = actualSchedule.cost;                                         // we update the bound and then
                            bestSchedule = actualSchedule;                                       // we update the best schedule
                            workingLoop(upper_counter - 1);                                      // finally we call another loop iteration.
                        }
                    }
                };



                costCalculator.completeScheduleEval({
                    tasks : actualSchedule.taskList,
                    travels : actualSchedule.travelList
                },      // here we call the initial schedule evaluation, and within its callback
                    (res) => {                                                                  // we call the subtree working loop
                    actualSchedule.cost(res);
                    subTreeWorkingLoop(0, actualSchedule);
                });
            } else {                                                                            // if the upper counter is equal to 0 it means that we explored completely
                callback(bestSchedule, cost);                                                   // the branch and bound tree, so we can complete the algorithm calling the callback
            }
        };

        // ============================E N D   I N N E R   R E C U R S I V E   L O O P S   F U N C T I O N S ================================

        workingLoop(schedule.travels.length - 3, (schedule, cost) => {                          // here we call the main working loop, working loop
            upper_callback(schedule);                                                           // and here we set as main working loop callback the algorithm upper callback
            //TODO VERIFY
        });


    };
    // --------------------------------E N D   A U X I L I A R Y   I N N E R   F U N C T I O N S   D E F S -----------------------------
    genInitSched(fixed, schedule, "TRANSIT");                                                  // here we generate the initial scheduling
    initEvalLoop(0, schedule, 0, fixedBranchNBound);                                           // here we evaluate the initial scheduling and call the fixedBranchNBound;

}
    ;
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
        if (flexible.length === 0) {
            callback.BnB(end)

        }
        let timeSlotsFlexibleTasks = [];
        flexible.sort((f1, f2) => {
            return f1.duration - f2.duration;
        });

        flexible.forEach((task) => {
            for (let index = 0; index < freeTimeslots.length; index++) {
                if (isFlexibleTaskCompliant(freeTimeslots[0], task, timeSlotsFlexibleTasks[index])) {
                    timeSlotsFlexibleTasks.push(task);
                    break;
                }
            }
        });

    };

    scheduleVariable = function (tasks, callback) {

    };
    isFlexibleTaskCompliant = function (timeslot, flexibleTask, others) {
        let checkOthers = function (others, slot, flexible) {
            let duration = timeslot.end - timeslot.start;
            let acc = flexible.duration;
            others.forEach((f) => {
                acc = +f.duration;
            });
            if (acc > duration) {
                return false;
            }
        };

        if (timeslot.start > flexibleTask.timeslot.start) {
            return false;
        }
        if (flexibleTask.timeslot.start > timeslot.start
            && flexibleTask.timeslot.end < timeslot.end) {
            return checkOthers(others, timeslot, flexibleTask)

        }
        if (flexibleTask.timeSlot.start > timeslot.start
            && flexibleTask.timeslot.end > timeslot.end) {
            if (flexibleTask.duration < timeslot.end - timeslot.start) {
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
        if (res.flag === true) {
            //TODO ERROR
        } else {
            occupiedTimeSlots.forEach((t, i, arr) => {
                freeTimeSlots.push(new entities.Timeslot(t.end, arr[i + 1].start));
            });
            return freeTimeSlots;
        }
    }
    scheduleFlexible = function (flexible, freeTimeSlots) {
        let couples = [];
        for (let i = 0; i < flexible.length; i++) {
            for (let j = 0; j < freeTimeSlots.length; j++) {
                if (flexible[i].containedIn(freeTimeSlots[j])) {
                    let c = {
                        task: flexible[i],
                        timeSlot: freeTimeSlots[j]
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
        if (tasks.length === 0) {
            let choices = [];
            end.allowedTransports.forEach((tm) => {                                // each choice is a JSON object relative to a travel, with references
                choices.push({                                                      // to the arrival and to the travel mean
                    mean: tm,
                    task: end
                });
            });
            let best = {
                cost: Infinity,
                schedule: null,
            }
            let checkBestTravel = function (index, best) {
                let cost = require('cost');
                let schedule = {
                    tasks: [start, end],
                    travels: [choices[index]],
                    next_increment: 0
                };
                cost.scheduleEval(schedule, (cost) => {
                    if (index < choices.length) {
                        if (cost < best.cost) {
                            best.schedule = new DaySchedule();
                            best.schedule.addTravel(
                                new ent.Travel(start,
                                    choices[index].task,
                                    choices[index].mean)
                            );
                            checkBestTravel(index + 1, cost);
                        }
                        checkBestTravel(index + 1, best);
                    }
                    else {
                        endCallback(best.schedule);

                    }
                })
            }


        }
        while (working) {
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
                    t.allowedTransports.forEach((tm) => {                          // each choice is a JSON object relative to a travel, with references
                        choices.push({                                              // to the arrival and to the travel mean
                            mean: tm,
                            task: t
                        });
                    });
                });

                while (lower_counter + upper_counter <                              // while there are possible choices OR
                bestSchedule.taskList.length ||                         // the actual solution is not complete (it means that every task as an associated
                choices.length > 0) {                                    // travel within the actual solution (and so exists an order between tasks))

                    let chosenIndex = selectRandomIndex(0, choices.length);         // chose an index indicating the chosen choice

                    let lastTask = actualSchedule.taskList.pop();                   // saves the last task in the solution popping it and then pushing it back
                    actualSchedule.taskList.push(lastTask);                         // it is necessary in order to build the "real" travel object, that needs both starting and ending tasks

                    let chosenElement = choices[chosenIndex];                       // extract the chosen element from the array
                    choices.splice(chosenIndex);                                    // remove the choice from the array

                    actualSchedule.addTravel(                                       // build the 'real' travel object and adds it to the schedule object
                        new ent.Travel(lastTask,
                            chosenElement.task,
                            chosenElement.mean)
                    )
                    ;
                    //  TODO : WRONG, THE NEW COST IS NOT CONTAINED WITHIN ACTUALSCHEDULE
                    // now we assume (IT IS WRONG, WEE NEED TO CHANGE IT) that the new cost is already present in Schedule object
                    if (actualSchedule.cost < bound) {                               // if the new cost is lower than the bound :

                        choices.forEach((c) => {                                     // we remove each choice built for the same task!
                            if (c.task === chosenElement.task)
                                choices.splice(choices.indexOf(c));
                        });
                        lower_counter++;                                            // and them we increment the lower counter so that
                                                                                    // it is possible to add more tasks in the next iteration
                    } else {
                        actualSchedule.removeLastTravel();                          // if the new cost is lower we need to remove the last travel we added
                                                                                    // schedule deals with removing the last travel's cost
                    }
                }                                                                   // we're exiting from the cycle that produces a solution

                if (actualSchedule.taskList.length < tasks.length) {                  // if not every tasks has been assigned:
                    // it means that every branch in the subtree is worse than the bound,
                    // but it can also means that something went wrong, so whe have to check it out
                    //TODO ;
                }

                if (actualSchedule.cost < bestSchedule.cost) {                       // if the actual schedule is better than the bound
                    bestSchedule = actualSchedule;                                  // we replace the bound with it
                }
                upper_counter--;                                                    // we decrement the upper counter so we can explore a wider subtree

                if (upper_counter < 0) {                                             // if upper counter is lesser than zero:
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
        for (let counter = 0; counter < tasks.length; counter++) {
            let dist = INF;
            let best = null;
            arr.forEach((t2) => {
                if (dist === INF) {
                    dist = distance(t.location, t2.location);
                }
                if (distance(t.location, t2.location) < dist) {
                    dist = distance(t.location, t2.location);
                    best = t2;
                }
            });
            startingSol.push(best);
            arr.splice(arr.indexOf(best));
            t = best
        }
        let startSched = new DaySchedule();
        for (let i = 0; i < startingSol.length - 1; i++) {
            startSched.addTravel(new ent.Travel(
                startingSol[i],
                startingSol[i + 1],
                defaultTransport));
        }
        ;
        return {
            sched: startSched,
            bound: startSched.cost
        }
    };


    selectRandomIndex = function (startingIndex, elements) {
        let getRandomArbitrary = function (min, max) {
            return Math.random() * (max - min) + min;
        }
        return startingIndex + getRandomArbitrary(0, elements);
    };

    checkOverlappings = function (TimeSlots) {
        let overlapping = [];
        for (let i = 0; i < TimeSlots.length; i++) {
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
            if (thisOverlapped.length > 0) {
                overlapping.push(thisOverlapped);
            }
        }
        let res = {
            overlappingList: overlapping,
            flag: false
        };

        if (overlapping.length > 0) {
            res.flag = true;
        }
        return res;

    };





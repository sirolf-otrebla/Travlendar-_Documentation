const INF = -1;

// must have home as first and last task of the queue;
// it is possible to consider as first bound a greedy approach;
exports.schedule = function (tasks, defaultTransport) {
    let ent = require('../entities');                                           // where to take business entities
    let bound = INF;                                                            // actual bound in BnB algorithm
    let bestSchedule = null;                                                    // actual best schedule found
    let working = true;                                                         // flag for main algorithm loop

    let upper_counter = 0;                                                      // root of analyzed subtree
    let lower_counter = 0;                                                      // subtree level being analyzed

    while (working){
        if (bound === INF) {                                                    // algorithm first step
            let init = generateInitSched(tasks, defaultTransport);              // generate a greedy solution (need a default travel mean)
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
                );
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


generateInitSched = function (tasks, defaultTransport) {
    let ent = require('../entities');
    let startingSol = [];
    let completed = true;
    let t = tasks[0];
    let arr = tasks.slice(1, tasks.length);
    startingSol.push(t);

    while (completed){
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
        let startSched = new DaySchedule();
        for (i = 0; i < startingSol.length - 1; i++){
            startSched.addTravel( new ent.Travel (
                startingSol[i],
                startingSol[i+1],
                defaultTransport ));
        }
        return {
            sched : startSched,
            bound : startSched.cost
        }
    }
};


selectRandomIndex = function (startingIndex, elements) {
    let getRandomArbitrary = function(min, max) {
        return Math.random() * (max - min) + min;
    }
    return startingIndex + getRandomArbitrary(0, elements);
};

class DaySchedule{
    _day;
    _cost;
    _lastTravelCost;
    _travelList;
    _taskList;

    addTravel(trav){
        if ( trav.startTask === this.taskList.pop() ||
            this.taskList.length === 0) {

            this._taskList.push(trav.startTask)
            this._travelList.push(trav);
            this._taskList.push(trav.endTask);
            this.calculateCost();
        }
    }

    calculateCost(){
        /* let calculator = require("./cost");
        this._cost = 0;
        this._travelList.forEach((t) => {
           this._cost += calculator.eval(this._day);
           this._lastTravelCost =  calculator.eval(this._day);
        });
        */
    }

    removeLastTravel(){
        this._cost -= this._lastTravelCost;
        this._taskList.pop();
        this._travelList.pop();
    }

    get cost() {
        return this._cost;
    }


    get taskList() {
        return this._taskList;
    }


    get travelList() {
        return this._travelList;
    }
}

distance = function(location, location2){
    if (location2 === null) return 0;
    return Math.sqrt(
        (location.lat - location2.lat)^2 +
        (location.long -location2.long)^2
    );
};
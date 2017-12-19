const INF = -1;

// must have home as first and last task of the queue;
// it is possible to consider as first bound a greedy approach;
exports.schedule = function (tasks, defaultTransport) {
    let ent = require('../entities');
    let bound = INF;
    let bestSchedule = null;
    let working = true;

    let upper_counter = 0;
    let lower_counter = 0;

    while (working){
        if (bound === INF) {
            let init = generateInitSched(tasks, defaultTransport);
            bestSchedule = new DaySchedule();
            init.forEach((t) => {
                bestSchedule.addTravel(t);
            });
            upper_counter = bestSchedule.taskList.length - 3;

            bound = init.bound;

        } else {
            let choices = [];
            let taskChoices = bestSchedule.taskList.slice(
                upper_counter, bestSchedule.taskList.length);
            let actualSchedule = new DaySchedule();
            bestSchedule.travelList.slice(0, upper_counter).forEach(
                (t) => {
                    actualSchedule.addTravel(t);
                }
            );
            taskChoices.forEach((t) => {
                t.allowedTransports.forEach((tm) =>  {
                    choices.push({
                        mean : tm,
                        task : t
                    });
                });
            });

            while (lower_counter + upper_counter < bestSchedule.taskList.length ||
                    choices.length > 0){
                let chosenIndex = selectRandomIndex(0, choices.length);

                let lastTask = actualSchedule.taskList.pop();
                actualSchedule.taskList.push(lastTask);

                let chosenElement = choices[chosenIndex];
                choices.splice(chosenIndex);

                actualSchedule.addTravel(
                    new ent.Travel(lastTask, chosenElement.task, chosenElement.mean)
                );

                if (actualSchedule.cost < bound){
                    choices.forEach((c)=> {
                        if( c.task === chosenElement.task)
                            choices.splice(choices.indexOf(c));
                    });
                    lower_counter++;
                } else{
                    actualSchedule.removeLastTravel();
                }
            }
            if(actualSchedule.taskList.length < tasks.length){
                //TODO ERROR;
            }
            if (actualSchedule.cost < bestSchedule.cost){
                bestSchedule = actualSchedule;
            }
            upper_counter--;
            if (upper_counter < 0){
                working = false;
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
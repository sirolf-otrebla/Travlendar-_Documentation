let entities = require('../logic/entities');

function adaptUser (user) {

    let new_user = new entities.User(user.IdUser,
                                     user.eMail,
                                     user.Name,
                                     user.Surname,
                                     user.Password,
                                     user.UserResidence);
    return new_user;
}


function adaptTask (task) {
    let new_preferences = new entities.TaskPreferences( task.TakeCar,
                                                        task.TakeBus,
                                                        task.TakeCarSharing,
                                                        task.TakeBikeSharing,
                                                        task.MaxWalk);

    let new_task = new entities.Task(   task.IdTask,
                                        task.IdUser,
                                        task.Name,
                                        task.Description,
                                        task.Location,
                                        task.Duration,
                                        task.StartTime, task.EndTime,
                                        task.StartDay, task.EndDay,
                                        task.isBreakTask,
                                        task.isPeriodic, task.DayPeriodicity,
                                        new_preferences);
    return new_task;
}

function adaptCalendar (calendar) {
    let new_calendar = new entities.Calendar();

    return new_calendar;
}

function adaptGlobalPreferences (global_preferences){
    let new_glob_pref = new entities.GlobalPreferences( global_preferences.TakeCar,
                                                        global_preferences.TakeBus,
                                                        global_preferences.TakeCarSharing,
                                                        global_preferences.TakeBikeSharing,
                                                        global_preferences.MaxWalk,
                                                        global_preferences.HasSeasonTicket);

    return new_glob_pref;
}

function adaptTaskPreferences (preferences) {
    let new_task_pref = new entities.TaskPreferences(   preferences.TakeCar,
                                                        preferences.TakeBus,
                                                        preferences.TakeCarSharing,
                                                        preferences.TakeBikeSharing,
                                                        preferences.MaxWalk);

    return new_task_pref;
}

exports.adaptEntities = function(element){
    let result;
    let type = element.type;

    if(type === "User" && element.user !== undefined)
        result.user = adaptUser(element.user);

    else if(type === "Tasks" && element.tasks !== undefined)
        result.tasks = adaptTask(element.tasks);

    else if(type === "TaskPreferences" && element.task_preferences !== undefined)
        result.task_preferences = adaptTaskPreferences(element.task_preferences);

    else if(type === "GlobalPreferences" && element.global_preferences !== undefined)
        result.global_preferences = adaptGlobalPreferences(element.global_preferences);

    else if(type === "Calendar" && element.calendar !== undefined)
        result.calendar = adaptCalendar(element.calendar);
    else
        result = element; //TODO: handle properly an error within the msg parsing
    return result;
};
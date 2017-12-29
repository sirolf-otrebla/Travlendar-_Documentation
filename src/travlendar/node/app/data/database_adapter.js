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

    if(type === "User")
        result = adaptUser(element);

    if(type === "Task")
        result = adaptTask(element);

    if(type === "TaskPreferences")
        result = adaptTaskPreferences(element);

    if(type === "GlobalPreferences")
        result = adaptGlobalPreferences(element);

    if(type === "Calendar")
        result = adaptCalendar(element);

    return result;
};
let entities = require('../logic/entities');

exports.adaptUser = function (user) {
    let new_user = new entities.User(user.IdUser,
                                     user.eMail,
                                     user.Name,
                                     user.Surname,
                                     user.Password,
                                     user.UserResidence);
    return new_user;
};


exports.adaptTask = function (task) {
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
};

exports.adaptCalendar = function (calendar) {
    let new_calendar = new entities.Calendar();

    return new_calendar;
};

exports.adaptGlobalPreferences = function (global_preferences){
    let new_glob_pref = new entities.GlobalPreferences( global_preferences.TakeCar,
                                                        global_preferences.TakeBus,
                                                        global_preferences.TakeCarSharing,
                                                        global_preferences.TakeBikeSharing,
                                                        global_preferences.MaxWalk,
                                                        global_preferences.HasSeasonTicket);

    return new_glob_pref;
};

exports.adaptTaskPreferences = function(preferences) {
    let new_task_pref = new entities.TaskPreferences(   preferences.TakeCar,
                                                        preferences.TakeBus,
                                                        preferences.TakeCarSharing,
                                                        preferences.TakeBikeSharing,
                                                        preferences.MaxWalk);

    return new_task_pref;
};
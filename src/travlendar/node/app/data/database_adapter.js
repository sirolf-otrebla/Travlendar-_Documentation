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
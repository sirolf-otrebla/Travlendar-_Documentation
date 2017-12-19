
exports.query_error = function (err) {
    let error = {
        description: "query error",
        code: err
    };     //TODO: add json for query_error
    return error;
};

exports.db_connection_error = function(err) {
    let error = {
        description: "connection with the database error",
        code: err
    };     //TODO: add json for db_connection_error
    return error;
}
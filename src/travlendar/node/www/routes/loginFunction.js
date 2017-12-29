let dispatcher = require('../dispatcher/dispatcher');

exports.checkUser = function (req, res) {
    let data = JSON.stringify({"email": req.body.email, "password": req.body.password, "requestedService": "login"});
    console.log(req.body.email + ' ' + req.body.password);
    if(req.body.email !== '' || req.body.password !== '') {
        dispatcher.sendMessage(req.body.email, data, function (message) {

            let json = JSON.parse(message);

            if (json.errorType !== undefined) {
                res.send('Error in Login\nError: ' + json.errorType);
            } else {
                if (json.loggedIn === 'true') {
                    req.session.email = json.email;
                    req.session.isLoggedIn = 'true';
                    res.redirect('/user');
                }
                else {
                    res.redirect('/');
                }
            }

        });
    } else
        res.redirect('/');
};
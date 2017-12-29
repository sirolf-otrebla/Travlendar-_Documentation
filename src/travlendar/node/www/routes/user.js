let express = require('express');
let router = express.Router();

//GET HOME PAGE
router.get('/', function(req, res) {
    if(req.session.isLoggedIn === 'true' && req.session.email !== undefined)
        res.render('user', {email: req.session.email});
    else
        res.send('The  current user cannot access to this personal area');
});

module.exports = router;
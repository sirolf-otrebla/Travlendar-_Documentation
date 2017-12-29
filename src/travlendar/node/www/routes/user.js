let express = require('express');
let router = express.Router();

//GET HOME PAGE
router.get('/', function(req, res) {
    res.render('user');
});

module.exports = router;
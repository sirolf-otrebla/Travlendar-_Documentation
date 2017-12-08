var express = require('express');
var router = express.Router();

//GET LOGIN PAGE
router.get('/', function(req, res) {
    res.render('login');
});

module.exports = router;
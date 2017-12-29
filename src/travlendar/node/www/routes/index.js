let express = require('express');
let loginFunction = require('./loginFunction');
let router = express.Router();

//GET HOME PAGE
router.get('/', function(req, res) {
   res.render('index');
});

router.post('/', function(req, res) {
   loginFunction.checkUser(req, res);
});

module.exports = router;
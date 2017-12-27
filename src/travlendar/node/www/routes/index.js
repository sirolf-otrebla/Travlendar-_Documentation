let express = require('express');
let router = express.Router();
let dispatcher = require('../dispatcher/dispatcher');


//GET HOME PAGE
router.get('/', function(req, res) {
   res.render('index');
});

router.post('/', function(req, res) {
   let data = JSON.stringify({"email": req.body.email, "password": req.body.password, "requestedService": "login"})
   dispatcher.sendMessage(req.body.email, data, function(message) {

      let json = JSON.parse(message);

      if(json.errorType !== undefined) {
         res.send('Error in Login');
      }

   });
});

module.exports = router;
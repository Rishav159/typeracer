var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(__dirname + '/../new_player.html')
});

module.exports = router;

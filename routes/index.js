var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/22', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

var express = require('express');
var router = express.Router();
var client = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/tasks';

  /* GET Login page. */
  router.get('/', function(req, res, next) {
    res.render('login', { title: 'login' });
    });


module.exports = router;

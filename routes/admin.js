var express = require('express');
var router = express.Router();
var client = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/tasks';

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('/admin', { title: 'express' });
});

module.exports = router;
var express = require('express');
var router = express.Router();
const models = require('../models')

/* GET home page. */
router.get('/', function(req, res, next) {
  models.Bar.findAll().then(bars => {
    res.render('index', {
      title: 'Sequelize: Bars',
      bars: bars
    })
  })
});

module.exports = router;

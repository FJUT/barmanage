var express = require('express');
var router = express.Router();
const models = require('../models')
const auth = require('../middlewares/auth')

/* GET users listing. */
router.get('/', auth, function (req, res, next) {
  models.User.findAll().then((result) => {
    if (!result)
      res.render('users', {err: '查找用户错误'});
    else
      res.render('users', {users: result, err: ''});
  }).catch((err) => {
    res.render('users', {err: err});
  })
});

router.get('/query', auth, function (req, res) {
  const {page} = req.body
  res.json({page: page});
});

router.get('/del', auth, function (req, res) {
  const {id} = req.body
  res.json({id: id});
});

module.exports = router;

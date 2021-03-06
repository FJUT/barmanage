var express = require("express");
var router = express.Router();
const co = require("co");
const models = require("../models");
const auth = require("../middlewares/auth");

/* GET users listing. */
router.get("/", auth, function(req, res, next) {
  let { id } = res.locals.barInfo;
  co(function*() {
    let sendMsgUsersResult = yield models.sequelize.query(
      `select distinct UserId from Messages where BarId = ${id}`
    );
    let users = [];
    if (sendMsgUsersResult && sendMsgUsersResult[0]) {
      let inUserArr = sendMsgUsersResult[0].map(o => o["UserId"]);
      users = yield models.User.findAll({
        where: { id: { $in: inUserArr } }
      });

      users = users.map(o => o.get({ plain: true }));

      let blacklist = yield models.BlackList.findAll({
        where: {
          BarId: id
        }
      });

      let blackIds = blacklist.map(o => o.UserId);
      let hash = blackIds.reduce((p, c) => {
        p[c] = true;
        return p;
      }, {});

      for (var i = 0; i < users.length; i++) {
        var userId = users[i].id;
        if (hash[userId]) {
          users[i].isBlack = true;
        } else {
          users[i].isBlack = false;
        }
      }
    }
    res.render("users", { users: users, err: "" });
  }).catch(err => {
    res.render("users", { err: err });
  });

  // models.User.findAll().then((result) => {
  //   if (!result)
  //     res.render('users', {err: '查找用户错误'});
  //   else
  //     res.render('users', {users: result, err: ''});
  // }).catch((err) => {
  //   res.render('users', {err: err});
  // })
});

router.get("/query", auth, function(req, res) {
  const { page } = req.body;
  res.json({ page: page });
});

router.get("/del", auth, function(req, res) {
  const { id } = req.body;
  res.json({ id: id });
});

module.exports = router;

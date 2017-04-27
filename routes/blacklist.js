/**
 * Created by shaojun on 2017/4/26.
 */
var express = require("express");
var router = express.Router();
const co = require("co");
const models = require("../models");
const auth = require("../middlewares/auth");

// 黑名单操作
router.post("/updateBlackList", (req, res, next) => {
  co(function*() {
    const barId = req.session.barInfo.id;
    const userId = req.body.userId;
    const isAdd = req.body.isAdd;

    if (isAdd == 1) {
      // 添加到黑名单
      let black_list = yield models.BlackList.create({
        BarId: barId,
        UserId: userId
      });
      if (black_list) res.json({ iRet: 0, msg: "插入记录成功" });
      else res.json({ iRet: -1, msg: "插入BlackList失败" });
    } else {
      // 移出黑名单
      models.BlackList
        .destroy({
          where: {
            BarId: barId,
            UserId: userId
          }
        })
        .then(deleteCount => {
          res.json({
            iRet: 0,
            deleteCount: deleteCount
          });
        });
    }
  }).catch(err => {
    res.json({
      iRet: -1
    });
  });
});

module.exports = router;

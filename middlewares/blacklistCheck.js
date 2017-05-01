/*
author: shinan
desc: 黑名单中间件
*/

var models = require('../models');

module.exports = (req, res, next) => {
  models.BlackList.count({
    where: {
      UserId: req.body.UserId,
      BarId: req.body.BarId
    }
  })
    .then(count => {
      if (count > 0) {
        res.json({
          iRet: -1,
          msg: '您已被禁言'
        })
        return
      }

      next()
    })
};

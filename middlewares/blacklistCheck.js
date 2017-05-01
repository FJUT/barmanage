/* 黑名单中间件 */

var models = require('../models');

module.exports = (req, res, next) => {
  models.Blacklist.count({
    where: {
      UserId: req.query.UserId,
      BarId: req.query.BarId
    }
  })
    .then(count => {
      if (count < 1) {
        next()
      } else {
        res.json({
          iRet: -1,
          msg: '您已被禁言'
        })
      }
    })
};

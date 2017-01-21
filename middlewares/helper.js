/**
 * Created by shinan on 2017/1/21.
 */
module.exports = function(req, res, next) {
  req.app.locals.url = (path) => {
    if (process.env.NODE_ENV === 'development') {
      return '/assets/' + path
    } else {
      return '/' + path
    }
  }

  next()
}
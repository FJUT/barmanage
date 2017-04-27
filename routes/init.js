var routes = require("./index");
var mainview = require("./mainview");
var occupy = require("./occupy");
var login = require("./login");
var order = require("./order");
var show = require("./show");
var admin = require("./admin");
var ajax = require("./ajax");
var users = require("./users");
var wx = require("./wx");
var message = require("./message");

module.exports = function(app) {
  app.use("/", routes);
  app.use("/mainview", mainview);
  app.use("/login", login);
  app.use("/occupy", occupy);
  app.use("/order", order);
  app.use("/show", show);
  app.use("/admin", admin);
  app.use("/users", users);
  app.use("/ajax", ajax);
  app.use("/wx", wx);
  app.use("/message", message);

  app.use("/blacklist", require("./blacklist"));
};

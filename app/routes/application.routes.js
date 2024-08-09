const UserController = require('../controllers/users.controller');

module.exports = function (app) {
  //Users
  app.route(app.rootUrl + '/users/signup').post(UserController.signUp);
  app.route(app.rootUrl + '/users/login').post(UserController.login);
  app.route(app.rootUrl + '/users/logout').post(UserController.logout);
};

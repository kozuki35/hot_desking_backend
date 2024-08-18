const UserController = require('../controllers/users.controller');

module.exports = function (app) {
  //Users
  app.route(app.rootUrl + '/users/signup').post(UserController.signUp);
  app.route(app.rootUrl + '/users/login').post(UserController.login);
  app.route(app.rootUrl + '/users/logout').post(UserController.logout);

  app.route(app.rootUrl + '/users').get(UserController.getAllUsers);
  app.route(app.rootUrl + '/users/:id').get(UserController.getUserById);
  app.route(app.rootUrl + '/users/:id').put(UserController.updateUserById);
  app.route(app.rootUrl + '/users/:id/profile').get(UserController.getProfile);
  app.route(app.rootUrl + '/users/:id/profile').put(UserController.updateProfile);
};

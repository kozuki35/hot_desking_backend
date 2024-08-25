const UserController = require('../controllers/users.controller');
const DeskController = require('../controllers/desks.controller');

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

  // Desks
  app.route(app.rootUrl + '/desks').get(DeskController.getDesksByStatus);
  app.route(app.rootUrl + '/desks/:id').get(DeskController.getDeskById);
  app.route(app.rootUrl + '/desks/:id').put(DeskController.updateDeskById);
  app.route(app.rootUrl + '/desks').post(DeskController.addDesk);
};

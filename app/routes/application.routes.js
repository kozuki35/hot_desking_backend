const UserController = require('../controllers/users.controller');
const DeskController = require('../controllers/desks.controller');
const BookingController = require('../controllers/bookings.controller');

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
  app.route(app.rootUrl + '/desks/booking').get(DeskController.getDesksBooking);
  app.route(app.rootUrl + '/desks/:id').get(DeskController.getDeskById);
  app.route(app.rootUrl + '/desks/:id').put(DeskController.updateDeskById);
  app.route(app.rootUrl + '/desks').post(DeskController.addDesk);

  // Booking
  app.route(app.rootUrl + '/bookings').get(BookingController.getBookingsByStatus);
  app.route(app.rootUrl + '/bookings/:id').put(BookingController.updateBooking);
  app.route(app.rootUrl + '/bookings/:id').delete(BookingController.cancelBookingById);
  app.route(app.rootUrl + '/bookings').post(BookingController.addBooking);

  // My Booking
  app.route(app.rootUrl + '/my-bookings').get(BookingController.getMyBookings);
  app.route(app.rootUrl + '/my-bookings/:id').put(BookingController.updateMyBooking);
};

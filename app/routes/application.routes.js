const users = require('../controllers/users.controller');

module.exports = function (app) {
    //Users
    app.route(app.rootUrl + '/users/signup')
        .post(users.register);
    app.route(app.rootUrl + '/users/login')
        .post(users.login);
    app.route(app.rootUrl + '/users/logout')
        .post(users.logout);
};

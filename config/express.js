const express = require('express');
const bodyParser = require('body-parser');
const requireAuth = require('../middleware/requireAuth');
const adminRoleCheck = require('../middleware/adminRoleCheck');

const allowCrossOriginRequests = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, X-Authorization, Authorization',
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS, DELETE, PUT');
  next();
};

module.exports = function () {
  const app = express();
  app.rootUrl = process.env.ROOT_RUL || '/api/v1';

  // MIDDLEWARE
  app.use(allowCrossOriginRequests);
  app.use(requireAuth);
  app.use(adminRoleCheck);
  app.use(bodyParser.json());
  app.use(bodyParser.raw({ type: 'text/plain' }));

  // ROUTES
  require('../app/routes/application.routes')(app);

  // DEBUG (you can remove this)
  app.get('/', function (req, res) {
    res.send({ message: 'Hello World!' });
  });

  return app;
};

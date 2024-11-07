const jwt = require('jsonwebtoken');
const user = require('../app/models/user');

// requireAuth middleware is applied to all routes except /login and /register
// to prevent unauthenticated users from accessing protected routes
const requireAuth = async (req, res, next) => {
  // allow OPTIONS method and /login and /signup routes
  if (
    req.method === 'OPTIONS' ||
    req.path === `${process.env.ROOT_RUL}/users/login` ||
    req.path === `${process.env.ROOT_RUL}/users/signup`
  ) {
    return next();
  }
  // verify user is authenticated
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const token = authorization.split(' ')[1];

  try {
    // verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { _id } = decodedToken;
    // check if user exists in the database and get user role
    req.user = await user.findOne({ _id }).select('_id role');
    console.log('user is authenticated');
    next();
  } catch (error) {
    console.log('Error while authenticating : ', error);
    return res.status(401).json({ error: 'Unauthorized!!!' });
  }
};

module.exports = requireAuth;

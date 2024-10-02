const adminRoleCheck = async (req, res, next) => {
  const { method, path, user } = req;

  const isUpdateProtectedPath =
    method === 'PUT' &&
    ['bookings', 'users', 'desks'].some((segment) => path.includes(`${process.env.ROOT_RUL}/${segment}/`));

  const isInsertProtectedPath =
    method === 'POST' && ['desks'].some((segment) => path.includes(`${process.env.ROOT_RUL}/${segment}`));

  if ((isUpdateProtectedPath || isInsertProtectedPath) && user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden! Admin access right is needed.' });
  }

  return next();
};

module.exports = adminRoleCheck;

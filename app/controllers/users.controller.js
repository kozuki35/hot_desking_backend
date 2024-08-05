/**
 * Register as a new user.
 */
exports.register = async function (req, res) {
    res.statusMessage = 'Created';
    res.status(201)
        .json('');
}

/**
 * Login as an existing user.
 */
exports.login = async function (req, res) {
    res.statusMessage = 'Login successfully';
    res.status(200)
        .json('');
}

/**
 * Logs out the currently authorised user.
 */
exports.logout = async function (req, res) {
    res.statusMessage = 'Logout successfully';
    res.status(200)
        .json('');
}
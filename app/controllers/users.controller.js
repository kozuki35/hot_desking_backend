const User = require('../models/user');

/**
 * Register as a new user.
 */
exports.register = async function (req, res) {
    try {
        const { name, email, password } = req.body;

        const newUser = new User({
            name: name,
            email: email,
            password: password,
        });

        await newUser.save(); // Save the new user to the database
        res.status(201).json({ message: 'Registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error registeration', error: error.message });
    }
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
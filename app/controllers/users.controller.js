const User = require('../models/user');
const bcrypt = require('bcrypt');

/**
 * Register as a new user.
 */
exports.register = async function (req, res) {
    try {
        const { name, email, password } = req.body;

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: 'Registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error during registeration', error: error.message });
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
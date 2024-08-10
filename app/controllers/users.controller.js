const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Sign up as a new user.
 */
exports.signUp = async function (req, res) {
    try {
        const { firstName, lastName, email, password } = req.body;

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: 'Signed up successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error during sign up', error: error.message });
    }
}

/**
 * Login as an existing user.
 */
exports.login = async function (req, res) {
    try {
        const { email, password } = req.body;

        // Check if the user exists with the provided email
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' } 
        );

        // Return success message along with user data and token
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token: token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

/**
 * Logs out the currently authorised user.
 */
exports.logout = async function (req, res) {
    try {
        // On the client side, remove the JWT token from storage
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ message: 'Error logging out', error: error.message });
    }
};

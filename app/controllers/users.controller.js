const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Sign up as a new user.
 */
const signUp = async function (req, res) {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email address already exists.' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate a JWT
    const token = jwt.sign({ id: newUser._id, email: newUser.email, role: newUser.role }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h',
    });

    res.status(201).json({ message: 'Signed up successfully', user: newUser, token });
  } catch (error) {
    res.status(500).json({ message: 'Error during sign up', error: error.message });
  }
};

/**
 * Login as an existing user.
 */
const login = async function (req, res) {
  try {
    const { email, password } = req.body;

    // Check if the user exists with the provided email
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify the passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT
    const token = jwt.sign({ _id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h',
    });

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
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
const logout = async function (req, res) {
  try {
    // On the client side, remove the JWT token from storage
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging out', error: error.message });
  }
};

/**
 * Get all users.
 */
const getAllUsers = async function (req, res) {
  try {
    const status = req.query.status;
    let users = undefined;
    if (status.toUpperCase() === 'ALL') {
      users = await User.find();
    } else {
      users = await User.find({ status: status });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error: error.message });
  }
};

/**
 * Get a user by ID.
 */
const getUserById = async function (req, res) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error: error.message });
  }
};

/**
 * Update a user by ID.(admin)
 */
const updateUserById = async function (req, res) {
  try {
    const { firstName, lastName, role, status } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, role, status },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

/**
 * Get profile (user)
 */
const getProfile = async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const token = authorization.split(' ')[1];

  try {
    // verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { _id } = decodedToken;

    // Check login user against reqeust user, must be the same
    if (_id !== req.params.id) {
      return res.status(404).json({ message: 'You can not get others profile.' });
    }

    // Find the user by ID
    const userProfile = await User.findById(_id);
    if (!userProfile) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'Get profile successfully.', user: userProfile });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};


/**
 * Update My profile by ID.(user)
 */
const updateMyProfile = async (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' });
  }
  const token = authorization.split(' ')[1];
  try {
    // Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { _id } = decodedToken;
    const { firstName, lastName, currentPassword, newPassword } = req.body;
    // Check if the logged-in user matches the request user
    if (_id !== req.params.id) {
      return res.status(404).json({ message: "You cannot update others' profiles." });
    }
    // Validate input
    if (!firstName || !lastName) {
      return res.status(400).json({ message: 'First name and last name are required.' });
    }
    // Find the user by ID
    const userProfile = await User.findById(_id);
    if (!userProfile) {
      return res.status(404).json({ message: 'User not found.' });
    }
    // Check if current password is provided and matches
    if (currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, userProfile.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect.' });
      }
    } else if (newPassword) {
      return res.status(400).json({ message: 'Current password is required to update the password.' });
    }
    // Update first and last name
    userProfile.firstName = firstName;
    userProfile.lastName = lastName;
    // Hash and update the new password if provided
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      userProfile.password = await bcrypt.hash(newPassword, salt);
    }
    // Save the updated user
    await userProfile.save();
    res.status(200).json({
      message: "Profile updated successfully.",
      user: {
        id: userProfile._id,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        email: userProfile.email,
        role: userProfile.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Export all functions consistently
module.exports = {
  signUp,
  login,
  logout,
  getAllUsers,
  getUserById,
  updateUserById,
  getProfile,
  updateMyProfile
};

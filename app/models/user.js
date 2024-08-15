const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: [true, "Please provide an Email!"], unique: [true, "Email Exist"] },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }, 
  created_at: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema, 'User');
module.exports = User;

const mongoose = require('mongoose');

const deskSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // Desk code like "D-001"
  location: { type: String, required: true }, // Location or room number
  isAvailable: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
});

const Desk = mongoose.model('Desk', deskSchema);
module.exports = Desk;

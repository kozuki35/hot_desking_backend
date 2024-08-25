const mongoose = require('mongoose');

const DeskSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // Desk code like "D-001"
  name: { type: String, required: true, unique: false },
  description: { type: String },
  location: { type: String, required: true }, // Location or room number
  status: { type: String, enum: ['active', 'draft', 'archived'], default: 'draft' },
  created_at: { type: Date, default: Date.now },
});

const Desk = mongoose.model('Desk', DeskSchema, 'Desk');
module.exports = Desk;

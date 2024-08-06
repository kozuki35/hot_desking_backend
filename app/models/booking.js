const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  desk: { type: mongoose.Schema.Types.ObjectId, ref: 'Desk', required: true },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  created_at: { type: Date, default: Date.now },
});

const Booking = mongoose.model('Booking', bookingSchema, 'Booking');
module.exports = Booking;

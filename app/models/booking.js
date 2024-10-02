const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  desk: { type: mongoose.Schema.Types.ObjectId, ref: 'Desk', required: true },
  booking_date: { type: String, required: true },
  time_slot: {
    value: { type: String, enum: ['morning', 'afternoon'], default: 'morning' },
    start_time: { type: String, default: '08:00' },
    end_time: { type: String, default: '12:00' },
  },
  status: { type: String, enum: ['active', 'cancelled', 'archived'], default: 'active' },
  created_at: { type: Date, default: Date.now },
});

const Booking = mongoose.model('Booking', BookingSchema, 'Booking');

const constructTimeSlot = (time_slot_type) => {
  return {
    value: time_slot_type,
    start_time: time_slot_type === 'morning' ? '8:00' : '12:00',
    end_time: time_slot_type === 'morning' ? '12:00' : '17:00',
  };
};

module.exports = { Booking, constructTimeSlot };

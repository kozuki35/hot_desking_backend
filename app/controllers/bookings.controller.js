const { Booking, constructTimeSlot } = require('../models/booking');

/**
 * Add a new booking.
 */
const addBooking = async function (req, res) {
  try {
    const { deskId, bookingDate, timeSlotValues } = req.body;

    const newBookings = timeSlotValues.map(
      (value) =>
        new Booking({
          user: req.user._id,
          desk: deskId,
          booking_date: bookingDate,
          time_slot: constructTimeSlot(value),
          status: 'active',
        }),
    );

    for (const booking of newBookings) {
      const existBooking = await Booking.findOne({
        user: booking.user,
        desk: booking.desk,
        booking_date: booking.booking_date,
        time_slot: booking.time_slot,
      });
      if (existBooking) {
        existBooking.status = 'active';
        existBooking.save();
      } else {
        booking.save();
      }
    }

    res.status(201).json({ message: `Booking on '${bookingDate}' added successfully`, booking: newBookings });
  } catch (error) {
    res.status(500).json({ message: 'Error during adding new booking', error: error.message });
  }
};

/**
 * Get all bookings of all users.
 */
const getBookings = async function (req, res) {
  try {
    const bookings = await Booking.find()
      .populate('user', 'firstName lastName') // Populating user details
      .populate('desk', 'code name location'); // Populating desk details

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};


// Get bookings by user ID
const getBookingByUserId = async function (req, res) {
  try {
    const userId = req.user._id;
    const bookings = await Booking.find({ user: userId })
      .populate('user', 'firstName lastName')
      .populate('desk', 'code name location');

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};


// Update a booking
const updateBooking = async (req, res) => {
  const { id } = req.params;
  const { user, desk, booking_date, time_slot, status } = req.body;

  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { user, desk, booking_date, time_slot: constructTimeSlot(time_slot.value), status },
      { new: true },
    );
    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Error updating booking' });
  }
};

/**
 * Cancel a booking by ID.
 */
const cancelBookingById = async function (req, res) {
  try {
    const cancelledBooking = await Booking.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true });
    res.status(200).json(cancelledBooking);
  } catch (error) {
    console.error('Error canceling booking:', error);
    res.status(500).json({ message: 'Error canceling booking', error: error.message });
  }
};

// Export all functions consistently
module.exports = {
  addBooking,
  getBookings,
  getBookingByUserId,
  updateBooking,
  cancelBookingById,
};

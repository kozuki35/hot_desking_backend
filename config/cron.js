const cron = require('node-cron');
const { Booking } = require('../app/models/booking');

exports.archiveBooking = function () {
  // Cron job to archive booking every midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('Running a cron job to archive booking');

    try {
      // Create a new Date and format it as YYYY-MM-DD
      let today = new Date();
      let yyyy = today.getFullYear();
      let mm = String(today.getMonth() + 1).padStart(2, '0');
      let dd = String(today.getDate()).padStart(2, '0');
      today = `${yyyy}-${mm}-${dd}`;

      // Find all bookings where booking_date is less than today
      const result = await Booking.updateMany(
        { booking_date: { $lt: today }, status: 'active' }, // Don't update already archived bookings
        { $set: { status: 'archived' } },
      );

      console.log(`${result.modifiedCount} bookings were archived`);
    } catch (error) {
      console.error('Error archive bookings:', error);
    }
  });
};

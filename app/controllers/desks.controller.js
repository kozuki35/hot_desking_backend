const Desk = require('../models/desk');

/**
 * Add a new desk.
 */
exports.addDesk = async function (req, res) {
  try {
    const { code, name, description, location, status } = req.body;

    const newDesk = new Desk({
      code: code,
      name: name,
      description: description,
      location: location,
      status: status,
    });

    await newDesk.save();

    res.status(201).json({ message: `Desk '${newDesk.code}' added successfully`, desk: newDesk });
  } catch (error) {
    // Check if the error is a duplicate key error
    if (error.code === 11000 && error.keyPattern?.code) {
      return res.status(400).json({ message: 'Desk code already exists. Please choose a different code.' });
    }

    // Handle any other errors
    res.status(500).json({ message: 'Error during adding a new desk', error: error.message });
  }
};

/**
 * Get desks.
 */
exports.getDesksByStatus = async function (req, res) {
  try {
    const status = req.query.status;
    let desks = undefined;
    if (status.toUpperCase() === 'ALL') {
      desks = await Desk.find();
    } else {
      desks = await Desk.find({ status: status });
    }
    res.status(200).json(desks);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving desks', error: error.message });
  }
};

/**
 * Get a desk by ID.
 */
exports.getDeskById = async function (req, res) {
  try {
    const desk = await Desk.findById(req.params.id);

    if (!desk) {
      return res.status(404).json({ message: `Desk with id '${req.params.id}' not found` });
    }

    res.status(200).json(desk);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving desk', error: error.message });
  }
};

/**
 * Get a desk by code.
 */
exports.getDeskByCode = async function (req, res) {
  try {
    const desk = await Desk.findOne({ code: req.query.code });

    if (!desk) {
      return res.status(404).json({ message: `Desk with code '${req.query.code}' not found` });
    }

    res.status(200).json(desk);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving desk', error: error.message });
  }
};

/**
 * Update a desk by ID.
 */
exports.updateDeskById = async function (req, res) {
  try {
    const updatedDesk = await Desk.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedDesk) {
      return res.status(404).json({ message: `Desk with id '${req.params.id}' not found` });
    }

    res.status(200).json({ message: `Desk with id '${req.params.id}' updated successfully`, desk: updatedDesk });
  } catch (error) {
    res.status(500).json({ message: 'Error updating desk', error: error.message });
  }
};

/**
 * Update a desk by code
 */
exports.updateDeskByCode = async function (req, res) {
  try {
    const updatedDesk = await Desk.findOneAndUpdate({ code: req.query.code }, req.body, { new: true });

    if (!updatedDesk) {
      return res.status(404).json({ message: `Desk with id '${req.params.id}' not found` });
    }

    res.status(200).json({ message: `Desk with id '${req.params.id}' updated successfully`, desk: updatedDesk });
  } catch (error) {
    res.status(500).json({ message: 'Error updating desk', error: error.message });
  }
};

/**
 * Get desks booking info
 */
exports.getDesksBooking = async function (req, res) {
  try {
    const desksBooking = await Desk.aggregate([
      {
        $lookup: {
          from: 'Booking',
          localField: '_id',
          foreignField: 'desk',
          pipeline: [{ $match: { booking_date: req.query.queryDate } }],
          as: 'bookings',
        },
      },
      {
        $match: {
          status: req.query.deskStatus || 'active', // Match by desk status if provided in query
        },
      },
    ]);

    if (desksBooking.length === 0) {
      return res.status(404).json({ message: `Desks with status: ${req.query.deskStatus} not found` });
    }

    res.status(200).json(desksBooking);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving desks booking info', error: error.message });
  }
};

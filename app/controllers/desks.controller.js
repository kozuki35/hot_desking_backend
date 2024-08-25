const Desk = require('../models/desk');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    res.status(500).json({ message: 'Error during adding a new desk', error: error.message });
  }
};

/**
 * Get desks.
 */
exports.getDesksByStatus = async function (req, res) {
  try {
    console.log(req);
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

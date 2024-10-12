const mongoose = require('mongoose');
let db = null;

const createDBConnection = async function () {
  // MongoDB Atlas connection string from environment variables
  const mongoURI = process.env.MONGODB_URI;
  // Connect to MongoDB Atlas
  mongoose.connect(mongoURI);

  // Check connection
  db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    console.log('Connected to MongoDB Atlas');
  });
};

const getDB = function () {
  return db;
};

module.exports = { createDBConnection, getDB };

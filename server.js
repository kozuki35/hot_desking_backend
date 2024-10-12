require('dotenv').config();

const db = require('./config/db');
const express = require('./config/express');
const cron = require('./config/cron');

const app = express();
const port = process.env.PORT || 3000;

// Test connection to MongoDB on start-up
async function testDbConnection() {
  try {
    await db.createDBConnection();
    cron.archiveBooking();
  } catch (err) {
    console.error(`Unable to connect to MongoDB: ${err.message}`);
    process.exit(1);
  }
}

testDbConnection().then(function () {
  app.listen(port, function () {
    console.log(`Listening on port: ${port}`);
  });
});

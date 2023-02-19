require('colors');
require('dotenv').config();

console.log(`let's go`.bgWhite);

const mongoose = require('mongoose');
const app = require('./app');

const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/dbConn');
const { logEvents } = require('./middleware/logger');

const PORT = process.env.PORT || 3500;

connectDB();

app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on('error', (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    'mongoErrLog.log'
  );
});

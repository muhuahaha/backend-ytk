require('colors');
require('dotenv').config();

const express = require('express');
const morgan = require('morgan');

console.log(`let's go`.bgWhite);

const app = express();
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');
const errorHandler = require('./middleware/errorHandler');
const { logger } = require('./middleware/logger');

app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/', require('./routes/root'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/notes', require('./routes/noteRoutes'));
app.use('/api/v1/challenges', require('./routes/challengeRoutes'));

app.use('/movies', require('./routes/movieRoutes'));

// CUSTOM MIDDLE WARE
app.use((req, res, next) => {
  console.log('Hey i am from middleware function 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ message: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

app.use(errorHandler);

module.exports = app;

// require('colors');
// require('dotenv').config();
// const fs = require('fs');

// const express = require('express');

// console.log(`let's go`.bgWhite);

// const app = express();
// const path = require('path');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// const mongoose = require('mongoose');
// const corsOptions = require('./config/corsOptions');
// const errorHandler = require('./middleware/errorHandler');
// const { logger, logEvents } = require('./middleware/logger');
// const connectDB = require('./config/dbConn');

// const PORT = process.env.PORT || 3500;

// console.log(process.env.NODE_ENV);

// connectDB();

// app.use(logger);
// app.use(cors(corsOptions));
// app.use(express.json());
// app.use(cookieParser());
// app.use('/', express.static(path.join(__dirname, '/public')));

// app.use('/', require('./routes/root'));
// app.use('/auth', require('./routes/authRoutes'));
// app.use('/users', require('./routes/userRoutes'));
// app.use('/notes', require('./routes/noteRoutes'));
// app.use('/challenges', require('./routes/challengeRoutes'));

// app.use('/movies', require('./routes/movieRoutes'));

// const challenges = JSON.parse(
//   fs.readFileSync(`${__dirname}/challenge-data/data/challenge-simple.json`)
// );

// // console.log(challenges);

// app.get('/api/v1/challenges', (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     results: challenges.length,
//     data: {
//       challenges,
//     },
//   });
// });

// app.post('/api/v1/challenges', (req, res) => {
//   // console.log(req);
//   console.log(req.body, 'body');

//   const newId = challenges[challenges.length - 1].id + 1;

//   const test = req.body;
//   const newChallenges = { id: newId, ...test };

//   challenges.push(newChallenges);

//   fs.writeFile(
//     `${__dirname}/challenge-data/data/challenge-simple.json`,
//     JSON.stringify(challenges),
//     (err) => {
//       res.status(201).json({
//         status: 'success',
//         challenges: newChallenges,
//       });
//     }
//   );
//   // res.send('POST NFT');
// });

// // GET SINGLE NFT

// app.get('/api/v1/challenges/:id', (req, res) => {
//   console.log(req.params);

//   const id = req.params.id * 1;
//   const challenge = challenges.find((el) => el.id === id);

//   //   if (id > nfts.length) {
//   if (!challenge) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       challenge,
//     },
//   });
// });

// // PATCH METHOD

// app.patch('/api/v1/challenges/:id', (req, res) => {
//   if (req.params.id * 1 > challenges.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       challenges: 'Updating challenges',
//     },
//   });
// });

// // //DELET METHOD

// app.delete('/api/v1/challenges/:id', (req, res) => {
//   if (req.params.id * 1 > challenges.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });

// // const port = 3000;
// // app.listen(port, () => {
// //   console.log(`App running on port ${port}....`);
// // });

// app.all('*', (req, res) => {
//   res.status(404);
//   if (req.accepts('html')) {
//     res.sendFile(path.join(__dirname, 'views', '404.html'));
//   } else if (req.accepts('json')) {
//     res.json({ message: '404 Not Found' });
//   } else {
//     res.type('txt').send('404 Not Found');
//   }
// });

// app.use(errorHandler);

// mongoose.connection.once('open', () => {
//   console.log('Connected to MongoDB');
//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// });

// mongoose.connection.on('error', (err) => {
//   console.log(err);
//   logEvents(
//     `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
//     'mongoErrLog.log'
//   );
// });

// /////PART 2 -----------------------

require('colors');
require('dotenv').config();
const fs = require('fs');

const express = require('express');

console.log(`let's go`.bgWhite);

const app = express();
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const corsOptions = require('./config/corsOptions');
const errorHandler = require('./middleware/errorHandler');
const { logger, logEvents } = require('./middleware/logger');
const connectDB = require('./config/dbConn');
// const { getAllChallenges } = require('./controllers/challengesController');

const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV);

connectDB();

app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, '/public')));

app.use('/', require('./routes/root'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/notes', require('./routes/noteRoutes'));
app.use('/challenges', require('./routes/challengeRoutes'));

app.use('/movies', require('./routes/movieRoutes'));

const challenges = JSON.parse(
  fs.readFileSync(`${__dirname}/challenge-data/data/challenge-simple.json`)
);

const getAllChallenges = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestTime: req.requestTime,
    results: challenges.length,
    data: {
      challenges,
    },
  });
};

// POST METHOD

const createChallenge = (req, res) => {
  console.log(req.body, 'req');

  const newId = challenges[challenges.length - 1].id + 1;
  const newChallenges = { id: newId, ...req.body };
  console.log(newChallenges, 'newChallenges');
  challenges.push(newChallenges);

  fs.writeFile(
    `${__dirname}/challenge-data/data/challenge-simple.json`,
    JSON.stringify(challenges),
    (err) => {
      res.status(201).json({
        status: 'success',
        challenge: newChallenges,
      });
    }
  );
};

// GET SINGLE NFT
const getSingleChallenge = (req, res) => {
  const id = req.params.id * 1;
  const challenge = challenges.find((el) => el.id === id);

  if (!challenge) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      challenge,
    },
  });
};
// PATCH METHOD
const updateChallenge = (req, res) => {
  if (req.params.id * 1 > challenges.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      challenge: 'Updating nft',
    },
  });
};
// DELET METHOD
const deleteChallenge = (req, res) => {
  if (req.params.id * 1 > challenges.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// app.get('/api/v1/challenges', getAllChallenges);
// app.post('/api/v1/challenges', createChallenge);
// app.get('/api/v1/challenges/:id', getSingleChallenge);
// app.patch('/api/v1/challenges/:id', updateChallenge);
// app.delete('/api/v1/challenges/:id', deleteChallenge);

app.route('/api/v1/challenges').get(getAllChallenges).post(createChallenge);

app
  .route('/api/v1/challenges/:id')
  .get(getSingleChallenge)
  .patch(updateChallenge)
  .delete(deleteChallenge);

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

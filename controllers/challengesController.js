const mongoose = require('mongoose');
const fs = require('fs');
const Challenge = require('../models/Challenge');
const User = require('../models/User');

// const challenges = JSON.parse(
//   fs.readFileSync(`${__dirname}/../challenge-data/data/challenge-simple.json`)
// );

// const checkId = (req, res, next, value) => {
//   console.log(`ID: ${value}`);
//   if (req.params.id * 1 > challenges.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }
//   next();
// };

// const checkBody = (req, res, next) => {
//   if (!req.body.title || !req.body.text) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name and price',
//     });
//   }
//   next();
// };

const APIFeatures = require('../Utils/apiFeatures');

const aliasTopChallenges = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,-price';
  req.query.fields = 'title,price,ratingsAverage,difficulty';
  next();
};

const getAllChallenges = async (req, res) => {
  const search = req.query.search || '';

  const features = new APIFeatures(
    Challenge.find({ title: { $regex: search, $options: 'i' } }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .pagination();
  const challenges = await features.query;

  res.status(200).json({
    status: 'success',
    results: challenges.length,
    data: { challenges },
  });
};

const createChallenge = async (req, res) => {
  const {
    user,
    title,
    text,
    url,
    difficulty,
    code,
    example,
    tags,
    bestSolution,
    profilImage,
    duration,
    secretChallenges,
  } = req.body;

  // Confirm data
  if ((!user || !title || !text || !url, !code, !example, !difficulty)) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check for duplicate title
  const duplicate = await Challenge.findOne({ title }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate note title' });
  }

  // Create and store the new user
  const challenge = await Challenge.create({
    user,
    title,
    text,
    url,
    code,
    difficulty,
    tags,
    example,
    bestSolution,
    profilImage,
    duration,
    secretChallenges,
  });

  if (challenge) {
    // Created
    return res.status(201).json({ message: 'New challenge created' });
  }
  return res.status(400).json({ message: 'Invalid challenge data received' });
};
// GET SINGLE NFT
const getSingleChallenge = (req, res) => {};
// PATCH METHOD
const updateChallenge = (req, res) => {};
// DELET METHOD
const deleteChallenge = (req, res) => {};

// Aggregation Pipeline

const getChallengesStats = async (req, res) => {
  try {
    const stats = await Challenge.aggregate([
      // {
      //   $match: { ratingsAverage: { $gte: 1 } },
      // },
      {
        $group: {
          // _id: "$ratingsAverage",
          _id: { $toUpper: '$difficulty' },
          numChallenge: { $sum: 1 },
          // numRatings: { $sum: '$ratingsQuantity' },
          // avgRating: { $avg: '$ratingsAverage' },
          // avgPrice: { $avg: '$price' },
          // minPrice: { $min: '$price' },
          // maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { numChallenge: -1 },
      },
      // {
      //   $match: {
      //     _id: { $ne: 'HARD' },
      //   },
      // },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

module.exports = {
  aliasTopChallenges,
  getAllChallenges,
  createChallenge,
  // getSingleChallenge,
  // updateChallenge,
  // deleteChallenge,
  getChallengesStats,
};

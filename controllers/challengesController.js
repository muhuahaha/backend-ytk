const mongoose = require('mongoose');
const fs = require('fs');
const Challenge = require('../models/Challenge');
const User = require('../models/User');

const challenges = JSON.parse(
  fs.readFileSync(`${__dirname}/../challenge-data/data/challenge-simple.json`)
);

const checkId = (req, res, next, value) => {
  console.log(`ID: ${value}`);
  if (req.params.id * 1 > challenges.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

const checkBody = (req, res, next) => {
  if (!req.body.title || !req.body.text) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name and price',
    });
  }
  next();
};

const getAllChallenges = async (req, res) => {
  if (!challenges?.length) {
    return res.status(400).json({ message: 'No Challenges found' });
  }
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
    `${__dirname}/../challenge-data/data/challenge-simple.json`,
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
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

module.exports = {
  getAllChallenges,
  createChallenge,
  getSingleChallenge,
  updateChallenge,
  deleteChallenge,
  checkId,
  checkBody,
};

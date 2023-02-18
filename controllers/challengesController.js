const mongoose = require('mongoose');
const Challenge = require('../models/Challenge');
const User = require('../models/User');

// @desc Get all notes
// @route GET /notes
// @access Private
const getAllChallenges = async (req, res) => {
  // Get all notes from MongoDB
  const challenges = await challenges.find().lean();
  // If no notes
  if (!challenges?.length) {
    return res.status(400).json({ message: 'No challenges found' });
  }

  // Add username to each note before sending the response
  // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE
  // You could also do this with a for...of loop
  const challengesWithUser = await Promise.all(
    challenges.map(async (note) => {
      const user = await User.findById(note.user).lean().exec();
      return { ...note, username: user.username };
    })
  );

  res.json(challengesWithUser);
};

module.exports = {
  getAllChallenges,
};

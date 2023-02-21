const fs = require('fs');
require('dotenv').config();

const mongoose = require('mongoose');
const slugify = require('slugify');
const Challenge = require('../../models/Challenge');

const connectDB = require('../../config/dbConn');

connectDB();

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB for Import');
});

const challenges = JSON.parse(
  fs.readFileSync(`${__dirname}/challenge-simple.json`, 'utf-8')
);

const newData = challenges.map(
  ({
    user,
    difficulty,
    duration,
    ratingsAverage,
    price,
    slug,
    title,
    ...rest
  }) => ({
    user: user.$oid.toString(),
    difficulty: difficulty[0],
    duration: Math.floor(Math.random() * 10) + 1,
    ratingsAverage: Math.floor(Math.random() * 5) + 1,
    price: Math.floor(Math.random() * 100) + 1,
    title,
    slug: slugify(title, { lower: true }),
    ...rest,
  })
);

console.log(newData, 'newData');

// IMPORT DATA
const importDate = async () => {
  try {
    await Challenge.create(newData);
    console.log('DATA successfully Loaded');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// DELETE DATA
const deleteData = async () => {
  try {
    await Challenge.deleteMany();
    console.log('DATA successfully Deleted');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

console.log(process.argv, 'process.argv');

if (process.argv[2] === '--import') {
  importDate();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

// node challenge-data/data/import-data.js --import

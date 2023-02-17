/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-expressions */
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Movie = require('../models/Movie');
const movies1 = require('../config/Movies.json');

const getAllMovies = asyncHandler(async (req, res) => {
  // const movies = await Movie.find().lean();

  // // If no notes
  // if (!movies?.length) {
  //   return res.status(400).json({ message: 'No notes found' });
  // }

  const page = parseInt(req.query.page) - 1 || 0;
  const limit = parseInt(req.query.limit) || 4;
  const search = req.query.search || '';
  let sort = req.query.sort || 'rating';
  let genre = req.query.genre || 'All';

  const genreOptions = [
    'Action',
    'Romance',
    'Fantasy',
    'Drama',
    'Crime',
    'Adventure',
    'Thriller',
    'Sci-fi',
    'Music',
    'Family',
  ];

  genre === 'All'
    ? (genre = [...genreOptions])
    : (genre = req.query.genre.split(','));
  req.query.sort ? (sort = req.query.sort.split(',')) : (sort = [sort]);

  const sortBy = {};
  if (sort[1]) {
    sortBy[sort[0]] = sort[1];
  } else {
    sortBy[sort[0]] = 'asc';
  }

  const movies = await Movie.find({ name: { $regex: search, $options: 'i' } })
    .where('genre')
    .in([...genre])
    .sort(sortBy)
    .skip(page * limit)
    .limit(limit);

  const total = await Movie.countDocuments({
    genre: { $in: [...genre] },
    name: { $regex: search, $options: 'i' },
  });

  const response = {
    error: false,
    total,
    page: page + 1,
    limit,
    genres: genreOptions,
    movies,
    numberOfPages: Math.ceil(total / limit),
  };

  res.json(response);
});

const searchMovieByName = asyncHandler(async (req, res) => {
  console.log(res.params?.name, 'params');
  const queryName = new RegExp(req.params?.name, 'i');

  if (queryName !== '') {
    const searchResults = await Movie.find({ name: queryName });
    console.log(searchResults, 'searchResults');

    if (!searchResults?.length) {
      return res.status(400).json({ message: 'No movies found' });
    }
    res.json(searchResults);
  }
});

const getPaginateMovies = asyncHandler(async (req, res) => {
  const { page } = req.query;
  const LIMIT = 6;
  const startIndex = (Number(page) - 1) * LIMIT;
  const total = await Movie.countDocuments({});
  const movies = await Movie.find()
    .sort({ _id: -1 })
    .limit(LIMIT)
    .skip(startIndex);

  if (!movies?.length) {
    return res.status(400).json({ message: 'No notes found' });
  }

  const response = {
    data: movies,
    currentPage: Number(page),
    numberOfPages: Math.ceil(total / LIMIT),
  };

  res.json(response);
});

const filterByDifficulty = asyncHandler(async (req, res) => {
  console.log(res.params?.name, 'params');
  const queryName = new RegExp(req.params?.name, 'i');

  if (queryName !== '') {
    const searchResults = await Movie.find({ name: queryName });
    console.log(searchResults, 'searchResults');

    if (!searchResults?.length) {
      return res.status(400).json({ message: 'No movies found' });
    }
    res.json(searchResults);
  }
});

// const insertMovies = async () => {
//   try {
//     const docs = await Movie.insertMany(movies1);
//     return Promise.resolve(docs);
//   } catch (err) {
//     return Promise.reject(err);
//   }
// };

// insertMovies()
//   .then((docs) => console.log(docs))
//   .catch((err) => console.log(err));

module.exports = {
  getAllMovies,
  searchMovieByName,
  getPaginateMovies,
  filterByDifficulty,
};

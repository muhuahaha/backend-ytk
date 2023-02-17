const express = require('express');

const router = express.Router();
const moviesController = require('../controllers/moviesController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);

router.route('/').get(moviesController.getAllMovies);

router.route('/search/:name').get(moviesController.searchMovieByName);
// get paginated Movies
router.route('/paginatedMovies').get(moviesController.getPaginateMovies);

module.exports = router;

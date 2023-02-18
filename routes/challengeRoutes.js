const express = require('express');

const router = express.Router();
const challengesController = require('../controllers/challengesController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);

router.route('/').get(challengesController.getAllChallenges);

module.exports = router;

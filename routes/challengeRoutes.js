const express = require('express');

const challengesController = require('../controllers/challengesController');

const router = express.Router();

// const verifyJWT = require('../middleware/verifyJWT');

// router.use(verifyJWT);

// router.param('id', challengesController.checkId);

// TOP 5 NFTs BY PRICE
router
  .route('/top-5-challenges')
  .get(
    challengesController.aliasTopChallenges,
    challengesController.getAllChallenges
  );

// STATS ROUTE
router.route('/challenges-stats').get(challengesController.getChallengesStats);

router
  .route('/')
  .get(challengesController.getAllChallenges)
  // .post(challengesController.checkBody, challengesController.createChallenge);
  .post(challengesController.createChallenge);

// router
//   .route('/:id')
//   .get(challengesController.getSingleChallenge)
//   .patch(challengesController.updateChallenge)
//   .delete(challengesController.deleteChallenge);

module.exports = router;

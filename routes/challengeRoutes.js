const express = require('express');

const challengesController = require('../controllers/challengesController');

const router = express.Router();

// const verifyJWT = require('../middleware/verifyJWT');

// router.use(verifyJWT);

router.param('id', challengesController.checkId);

router
  .route('/')
  .get(challengesController.getAllChallenges)
  .post(challengesController.checkBody, challengesController.createChallenge);

router
  .route('/:id')
  .get(challengesController.getSingleChallenge)
  .patch(challengesController.updateChallenge)
  .delete(challengesController.deleteChallenge);

module.exports = router;

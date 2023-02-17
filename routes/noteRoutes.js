const express = require('express');

const router = express.Router();
const notesController = require('../controllers/notesController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);

router
  .route('/')
  .get(notesController.getAllNotes)
  .get(notesController.getSingleNote)
  .get(notesController.searchNoteByTitle)
  .post(notesController.createNewNote)
  .patch(notesController.updateNote)
  .delete(notesController.deleteNote);

module.exports = router;

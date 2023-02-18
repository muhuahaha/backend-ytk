const mongoose = require('mongoose');
const Note = require('../models/Note');
const User = require('../models/User');

// @desc Get all notes
// @route GET /notes
// @access Private
const getAllNotes = async (req, res) => {
  // Get all notes from MongoDB
  const notes = await Note.find().lean();
  // If no notes
  if (!notes?.length) {
    return res.status(400).json({ message: 'No notes found' });
  }

  // Add username to each note before sending the response
  // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE
  // You could also do this with a for...of loop
  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.user).lean().exec();
      return { ...note, username: user.username };
    })
  );

  res.json(notesWithUser);
};

const getSingleNote = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'No such workout' });
  }

  const note = await Note.findById(id);

  if (!note) {
    return res.status(404).json({ message: 'No such workout' });
  }

  res.status(200).json(note);
};

// @desc Create new note
// @route POST /notes
// @access Private
const createNewNote = async (req, res) => {
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
  } = req.body;

  // Confirm data
  if ((!user || !title || !text || !url, !code, !example, !difficulty)) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check for duplicate title
  const duplicate = await Note.findOne({ title }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate note title' });
  }

  // Create and store the new user
  const note = await Note.create({
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
  });

  if (note) {
    // Created
    return res.status(201).json({ message: 'New note created' });
  }
  return res.status(400).json({ message: 'Invalid note data received' });
};

// @desc Update a note
// @route PATCH /notes
// @access Private
const updateNote = async (req, res) => {
  const {
    id,
    user,
    title,
    text,
    code,
    url,
    tags,
    difficulty,
    example,
    bestSolution,
    completed,
  } = req.body;

  // Confirm data
  if (
    !id ||
    !user ||
    !title ||
    !text ||
    !url ||
    !code ||
    !example ||
    !Array.isArray(difficulty) ||
    !difficulty.length ||
    typeof completed !== 'boolean'
  ) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Confirm note exists to update
  const note = await Note.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: 'Note not found' });
  }

  // Check for duplicate title
  const duplicate = await Note.findOne({ title }).lean().exec();

  // Allow renaming of the original note
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate note title' });
  }

  note.user = user;
  note.title = title;
  note.text = text;
  note.url = url;
  note.difficulty = difficulty;
  note.code = code;
  note.example = example;
  note.bestSolution = bestSolution;
  note.tags = tags;
  note.completed = completed;

  const updatedNote = await note.save();

  res.json(`'${updatedNote.title}' updated`);
};

// @desc Delete a note
// @route DELETE /notes
// @access Private
const deleteNote = async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: 'Note ID required' });
  }

  // Confirm note exists to delete
  const note = await Note.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: 'Note not found' });
  }

  const result = await note.deleteOne();

  const reply = `Note '${result.title}' with ID ${result._id} deleted`;

  res.json(reply);
};

const searchNoteByTitle = async (req, res) => {
  const queryTitle = new RegExp(req.params?.title, 'i');
  // Get all notes from MongoDB
  const notes = await Note.find({ title: queryTitle });

  console.log(notes, 'notes from search');
  // If no notes
  if (!notes?.length) {
    return res.status(400).json({ message: 'No notes found' });
  }

  // Add username to each note before sending the response
  // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE
  // You could also do this with a for...of loop
  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.user).lean().exec();
      return { ...note, username: user.username };
    })
  );

  res.json(notesWithUser);
};

module.exports = {
  getAllNotes,
  getSingleNote,
  searchNoteByTitle,
  createNewNote,
  updateNote,
  deleteNote,
};

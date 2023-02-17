const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    example: {
      type: String,
    },
    code: {
      type: String,
      required: true,
    },
    bestSolution: {
      type: String,
    },
    difficulty: {
      type: [String],
      require: [true, 'Please select a difficulty'],
      enum: ['Very Easy', 'Easy', 'Medium', 'Hard', 'Very Hard', 'Expert'],
    },
    tags: {
      type: [String],
      enum: [
        'Algebra',
        'Algorithms',
        'Array',
        'Bit Operations',
        'Bug Fixes',
        'Classes',
        'Closures',
        'Conditions',
        'Control Flow',
        'Cryptography',
        'Data Structures',
        'Dates',
        'Formatting',
        'Functional Programming',
        'Game',
        'Geometry',
        'Higher Order Functions',
        'Interview',
        'Language Fundamentals',
        'Logic',
        'Loops',
        'Math',
        'Matrix',
        'Numbers',
        'Objects',
        'Physics',
        'Recursion',
        'Reducer',
        'Regex',
        'Scope',
        'Sorting',
        'Strings',
        'Validation',
      ],
      default: false,
    },
    profilImage: { type: String },
    completed: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      require: true,
      enum: ['new', 'open', 'closed'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

noteSchema.plugin(AutoIncrement, {
  inc_field: 'ticket',
  id: 'ticketNums',
  start_seq: 500,
});

module.exports = mongoose.model('Note', noteSchema);

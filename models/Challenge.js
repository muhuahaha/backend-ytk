const mongoose = require('mongoose');

const AutoIncrement = require('mongoose-sequence')(mongoose);
const slugify = require('slugify');
const validator = require('validator');

const challengeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'A Challenge must have a name'],
      unique: true,
      trim: true,
      // maxlength: [40, 'Challenge Title must have 40 character'],
      // minlength: [10, 'Challenge Title must have 10 character'],
    },
    slug: String,
    text: {
      type: String,
      trim: true,
      required: [true, 'must provide the summary'],
    },
    url: {
      type: String,
      required: true,
    },
    example: {
      type: String,
      trim: true,
    },
    code: {
      type: String,
      required: true,
    },
    bestSolution: {
      type: String,
    },
    difficulty: {
      type: String,
      require: [true, 'Please select a difficulty'],
      enum: ['Very Easy', 'Easy', 'Medium', 'Hard', 'Very Hard', 'Expert'],
    },
    duration: {
      type: Number,
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
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    price: {
      type: Number,
    },
    ratingsAverage: {
      type: Number,
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    secretChallenges: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  {
    timestamps: true,
  }
);

challengeSchema.virtual('durationWeeks').get(function () {
  console.log(this.duration, 'this duration');
  return this.duration / 7;
});

// MONGOOSE MIDDLEWARE

// DOCUMNT MIDDLEWARE: runs before .save() or .create()
challengeSchema.pre('save', function (next) {
  // console.log(this);
  console.log(slugify(this.title, { lower: true }), 'slug');
  this.slug = slugify(this.title, { lower: true });
  next();
});

challengeSchema.pre(/^find/, function (next) {
  this.find({ secretChallenges: { $ne: true } });
  this.start = Date.now();
  next();
});

// -----post
challengeSchema.post(/^find/, function (doc, next) {
  console.log(`Query took time: ${Date.now() - this.start} times`);
  // console.log(doc);
  next();
});

challengeSchema.pre('save', (next) => {
  console.log('document will save....');
  next();
});

challengeSchema.post('save', (doc, next) => {
  console.log(doc);
  next();
});

challengeSchema.plugin(AutoIncrement, {
  inc_field: 'challenge',
  id: 'challengeNums',
  start_seq: 500,
});

module.exports = mongoose.model('Challenge', challengeSchema);

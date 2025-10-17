const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String
});

const bookSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true
  },
  authors: {
    type: [authorSchema],
    required: [true, 'At least one author is required'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Book must have at least one author'
    }
  },
  genre: {
    type: [String],
    required: [true, 'At least one genre is required'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Book must have at least one genre'
    }
  },
  description: {
    type: String,
    trim: true
  },
  publishedDate: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: Number,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  coverUrl: {
    type: String,
    trim: true
  },
  pages: {
    type: Number,
    min: [1, 'Pages must be at least 1']
  },
  isbn: {
    type: String,
    trim: true
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-save middleware
bookSchema.pre('save', function(next) {
  // Remove empty genres
  if (this.genre) {
    this.genre = this.genre.filter(g => g && g.trim().length > 0);
  }
  
  // Validate authors have required fields
  if (this.authors) {
    const invalidAuthors = this.authors.filter(author => 
      !author.name || author.name.trim().length === 0
    );
    if (invalidAuthors.length > 0) {
      next(new Error('All authors must have a name'));
      return;
    }
  }

  // Clean up strings
  if (this.isbn) this.isbn = this.isbn.trim();
  
  next();
});

module.exports = mongoose.model("Book", bookSchema);

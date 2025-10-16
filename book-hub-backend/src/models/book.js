const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String
});

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authors: [authorSchema],
  genre: [String],
  description: String,
  publishedDate: Date,
  rating: Number,
  coverUrl: String,
  pages: Number,
  isbn: String
}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema);

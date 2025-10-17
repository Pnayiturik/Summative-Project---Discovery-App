const Book = require('../models/book');

module.exports = async function checkBookOwnership(req, res, next) {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if the logged-in user is the creator of the book
    if (book.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to perform this action' });
    }

    // If we reach here, the user is authorized
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
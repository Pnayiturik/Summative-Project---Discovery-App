const express = require("express");
const mongoose = require("mongoose");
const Book = require("../models/book");
const auth = require("../middleware/auth");
const router = express.Router();

// Middleware to check if user owns the book
const isBookOwner = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    
    if (book.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to perform this action" });
    }
    
    req.book = book;
    next();
  } catch (error) {
    res.status(500).json({ message: "Error checking book ownership" });
  }
};

// GET /api/books  -> list + filtering + pagination
router.get("/", async (req, res) => {
  try {
    console.log('Received GET /books request');
    console.log('Query params:', req.query);
    
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const pageSize = Math.max(1, parseInt(req.query.pageSize) || 12);
    const { query, genres, authors, sortBy, startDate, endDate } = req.query;
    
    const filter = {};
    
    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      console.error('Database not connected. Connection state:', mongoose.connection.readyState);
      throw new Error('Database connection is not ready');
    }

    if (query) {
      filter.$or = [
        { title: new RegExp(query, "i") },
        { "authors.name": new RegExp(query, "i") },
        { description: new RegExp(query, "i") }
      ];
    }
    if (genres) filter.genre = { $in: Array.isArray(genres) ? genres : genres.split(",") };
    if (authors) filter["authors.name"] = { $in: Array.isArray(authors) ? authors : authors.split(",") };
    if (startDate || endDate) {
      filter.publishedDate = {};
      if (startDate) filter.publishedDate.$gte = new Date(startDate);
      if (endDate) filter.publishedDate.$lte = new Date(endDate);
    }

    const sort = {};
    if (sortBy === "rating") sort.rating = -1;
    else if (sortBy === "title") sort.title = 1;
    else sort.publishedDate = -1;

    const skip = (page - 1) * pageSize;
    
    console.log('Executing query with filter:', filter);
    console.log('Sort:', sort);
    console.log('Skip:', skip);
    console.log('Limit:', pageSize);

    const [books, total] = await Promise.all([
      Book.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Book.countDocuments(filter)
    ]);

    const numPages = Math.ceil(total / pageSize);
    console.log(`Found ${books.length} books out of ${total} total, Page ${page} of ${numPages}`);
    res.json({ 
      data: books, 
      meta: { 
        total, 
        page: parseInt(page), 
        pageSize: parseInt(pageSize),
        totalPages: numPages,
        filter,
        sort
      } 
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    
    // Check for specific error types
    if (error.name === 'MongooseError' || error.name === 'MongoError') {
      res.status(503).json({ 
        message: 'Database error, please try again', 
        error: error.message 
      });
    } else if (error.message.includes('Database connection is not ready')) {
      res.status(503).json({ 
        message: 'Database connection error, please try again', 
        error: error.message 
      });
    } else {
      res.status(500).json({ 
        message: 'Failed to fetch books', 
        error: error.message 
      });
    }
  }
});

// GET /api/books/:id
router.get("/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "Not found" });
  res.json(book);
});

// POST /api/books (create) - protected
router.post("/", auth, async (req, res) => {
  try {
    console.log('POST /books request:', { userId: req.user?.userId, body: req.body });
    
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const book = new Book({
      ...req.body,
      createdBy: req.user.userId
    });
    
    const savedBook = await book.save();
    console.log('Book created successfully:', savedBook._id);
    res.status(201).json(savedBook);
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(400).json({ message: error.message || 'Failed to create book' });
  }
});

// PUT /api/books/:id - protected, owner only
router.put("/:id", auth, isBookOwner, async (req, res) => {
  try {
    const allowedUpdates = ['title', 'authors', 'genre', 'description', 'publishedDate', 'rating', 'coverUrl', 'pages', 'isbn'];
    const updates = Object.keys(req.body).filter(key => allowedUpdates.includes(key));
    
    updates.forEach(update => req.book[update] = req.body[update]);
    await req.book.save();
    
    res.json(req.book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/books/:id - protected, owner only
router.delete("/:id", auth, isBookOwner, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

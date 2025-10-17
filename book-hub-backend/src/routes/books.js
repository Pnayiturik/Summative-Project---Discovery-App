const express = require("express");
const mongoose = require("mongoose");
const Book = require("../models/book");
const router = express.Router();

// GET /api/books  -> list + filtering + pagination
router.get("/", async (req, res) => {
  try {
    console.log('Received GET /books request');
    console.log('Query params:', req.query);
    
    const { page = 1, pageSize = 12, query, genres, authors, sortBy, startDate, endDate } = req.query;
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

    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    
    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database connection is not ready');
    }

    console.log('Executing query with filter:', filter);
    console.log('Sort:', sort);
    console.log('Skip:', skip);
    console.log('Limit:', pageSize);

    const books = await Book.find(filter).sort(sort).skip(skip).limit(parseInt(pageSize));
    const total = await Book.countDocuments(filter);

    console.log(`Found ${books.length} books out of ${total} total`);

    res.json({ 
      data: books, 
      meta: { 
        total, 
        page: parseInt(page), 
        pageSize: parseInt(pageSize),
        filter,
        sort
      } 
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ 
      message: 'Failed to fetch books', 
      error: error.message 
    });
  }
});

// GET /api/books/:id
router.get("/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "Not found" });
  res.json(book);
});

// POST /api/books (create) -- protected ideally
router.post("/", async (req, res) => {
  const b = new Book(req.body);
  await b.save();
  res.status(201).json(b);
});

// PUT /api/books/:id
router.put("/:id", async (req, res) => {
  const updated = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE /api/books/:id
router.delete("/:id", async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

module.exports = router;

const Book = require('../models/book')

exports.list = async (req, res, next) => {
  try {
    const q = req.query.search
    const filter = q ? { title: new RegExp(q, 'i') } : {}
    const books = await Book.find(filter).limit(50).lean()
    res.json(books)
  } catch (err) {
    next(err)
  }
}

exports.create = async (req, res, next) => {
  try {
    const book = await Book.create(req.body)
    res.status(201).json(book)
  } catch (err) {
    next(err)
  }
}

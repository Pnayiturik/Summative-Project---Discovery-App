const express = require('express')
const router = express.Router()
const books = require('../controllers/booksController')

router.get('/', books.list)
router.post('/', books.create)

module.exports = router

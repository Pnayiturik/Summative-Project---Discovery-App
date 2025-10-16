require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// Simple health route
app.get('/ping', (req, res) => res.json({ ok: true }))

// Example route mount
app.use('/api/books', require('./routes/books'))

// Error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal Server Error' })
})

const PORT = process.env.PORT || 4000
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/bookhub'

mongoose
  .connect(MONGO)
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch((err) => {
    console.error('Failed to connect to Mongo', err)
  })

require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bookRoutes = require("./routes/books");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);

const PORT = 4000; // Explicitly set to 4000
// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ message: err.message || 'Something broke!' });
});

// Connect to MongoDB and start server
async function startServer() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/bookhub';
    console.log('Connecting to MongoDB at:', mongoUri);
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      heartbeatFrequencyMS: 5000,     // Check server status every 5 seconds
      socketTimeoutMS: 60000,         // Close sockets after 60 seconds of inactivity
      maxPoolSize: 50,                // Maximum number of connections
      minPoolSize: 5,                 // Minimum number of connections
      retryWrites: true,             // Retry failed writes
      retryReads: true,              // Retry failed reads
      connectTimeoutMS: 10000,       // Connection timeout
      family: 4                      // Use IPv4
    });
    
    console.log("Connected to MongoDB database");
    
    // Create indexes for better query performance
    const Book = require('./models/book');
    const User = require('./models/user');
    
    await Promise.all([
      Book.createIndexes(),
      User.createIndexes()
    ]);
    
    console.log("Database indexes created");
    
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log('----------------------------------');
      console.log(`Server is running on port ${PORT}`);
      console.log(`Try: http://localhost:${PORT}/api/books`);
      console.log('----------------------------------');
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please try a different port.`);
      } else {
        console.error('Server error:', error);
      }
      process.exit(1);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('Received SIGTERM. Shutting down gracefully...');
      server.close(() => {
        console.log('Server closed.');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('Received SIGINT. Shutting down gracefully...');
      server.close(() => {
        console.log('Server closed.');
        process.exit(0);
      });
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();

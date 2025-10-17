require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bookRoutes = require("./routes/books");
const authRoutes = require("./routes/auth");

const app = express();
// Add detailed request logging
app.use((req, res, next) => {
  console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Allow frontend domains
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add CORS debug logging
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`Response Status: ${res.statusCode}`);
    console.log('Response Headers:', res.getHeaders());
  });
  next();
});

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.body);
  next();
});

app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 8000;
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// Connect to MongoDB and start server
async function startServer() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/bookhub';
    console.log('Connecting to MongoDB at:', mongoUri);
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      heartbeatFrequencyMS: 2000,    // Check server status every 2 seconds
      socketTimeoutMS: 45000,        // Close sockets after 45 seconds of inactivity
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

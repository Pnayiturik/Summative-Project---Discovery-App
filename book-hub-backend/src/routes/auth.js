const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    console.log('Registration attempt:', req.body);
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      console.log('Missing required fields:', { username, email, password: !!password });
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email 
          ? 'Email already registered' 
          : 'Username already taken'
      });
    }

    // Create new user
    console.log('Creating new user with:', { username, email });
    const user = new User({ username, email, password });
    await user.save();
    console.log('User created successfully:', user._id);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Return user info and token
    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error creating account' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt with:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Missing credentials:', { email: !!email, password: !!password });
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    console.log('Looking for user with email:', email);
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('No user found with email:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    console.log('Checking password for user:', user.email);
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      console.log('Invalid password for user:', user.email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('Login successful for user:', user.email);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Return user info and token
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in: ' + error.message });
  }
});

module.exports = router;

const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./schema'); // Import the User model

dotenv.config(); // Load environment variables

const app = express();
const port = 3010;

app.use(express.json()); // Middleware to parse JSON request bodies

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to database'))
  .catch((err) => console.log('Error connecting to database', err));

// Serve static files (if any)
app.use(express.static('static'));

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

// POST API - Create a new user
app.post('/api/users', async (req, res) => {
  const { name, email, password } = req.body;

  // Validate data
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Validation error: All fields are required' });
  }

  try {
    // Create new user document
    const newUser = new User({ name, email, password });

    // Save user to MongoDB
    await newUser.save();

    // Respond with success message
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

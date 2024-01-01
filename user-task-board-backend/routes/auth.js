const express = require('express');
const { User } = require('../models');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { userId, password } = req.body;

    // Check if user ID and password are provided
    if (!userId || !password) {
      return res.status(400).json({ error: 'User ID and password are required' });
    }

    // Find the user by user ID
    const user = await User.findOne({ where: { id: userId } });

    // Check if the user exists and if the password is correct
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // You can add any additional user information to the response if needed
    const responseData = {
      userId: user.id,
      username: user.username,
      // Add more user-related information as needed
    };

    // Send the user information in the response
    res.json(responseData);
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, password } = req.body;

    // Check if name and password are provided
    if (!name || !password) {
      return res.status(400).json({ error: 'Name and password are required' });
    }

    // Check if the user with the provided name already exists
    const existingUser = await User.findOne({ where: { username: name } });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this name already exists' });
    }

    // Create a new user
    const newUser = await User.create({
      username: name,
      password: password,
      // Add more user-related information as needed
    });

    // Include additional user information in the response
    const responseData = {
      userId: newUser.id,
      username: newUser.username,
      // Add more user-related information as needed
    };

    // Send the user information in the response
    res.status(201).json(responseData);
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;

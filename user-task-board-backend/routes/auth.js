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

module.exports = router;

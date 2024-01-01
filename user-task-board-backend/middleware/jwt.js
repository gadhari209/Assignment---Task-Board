const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Your secret key for JWT
const secretKey = 'yourSecretKey';

// Your JWT middleware code goes here
const jwtMiddleware = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Missing token' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized - Invalid user' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error);
    res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

module.exports = jwtMiddleware;

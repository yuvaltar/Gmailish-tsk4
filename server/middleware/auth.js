
const jwt = require('jsonwebtoken');
const { getUserById } = require('../models/user');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  const token = authHeader.split(' ')[1];
  try {
    // Verify signature and expiry
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Lookup user by ID in payload
    const user = getUserById(payload.userId);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token: user not found' });
    }
    // Attach full user object for downstream handlers
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = authenticate;


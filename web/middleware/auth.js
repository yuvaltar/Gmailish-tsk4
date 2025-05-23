// web/middleware/auth.js
const { users } = require('../models/user');

function requireAuth(req, res, next) {
  const userId = req.header('X-User-Id');
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  req.user = user; // Attach user object to request
  next();
}

module.exports = requireAuth;

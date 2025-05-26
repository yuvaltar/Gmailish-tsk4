// web/middleware/auth.js
// loads the list of users from memory from models
const { users } = require('../models/user');
// function that reads the user id from url and checks to find if exits
function requireAuth(req, res, next) {
  const userId = req.header('X-User-Id');
  const user = users.find(u => u.id === userId);
// if the user doesn't exist, it sends back a 401 Unauthorized error.
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
// if the user is valid, it attaches that user object to req.user 
// so that all your controllers can access it.
  req.user = user; // Attach user object to request
  next();
}

module.exports = requireAuth;

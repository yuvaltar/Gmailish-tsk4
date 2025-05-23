const { findUserByCredentials } = require('../models/user');

// POST /api/tokens
exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const user = findUserByCredentials(username, password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Client must send this ID in the header for all future requests
  res.status(200).json({ userId: user.id });
};

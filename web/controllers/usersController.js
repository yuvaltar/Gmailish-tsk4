const { createUser, getUserById } = require('../models/user');

// POST /api/users
exports.registerUser = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const newUser = createUser(username, password);
  res.status(201).json({ id: newUser.id, username: newUser.username });
};

// GET /api/users/:id
exports.getUser = (req, res) => {
  const user = getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.status(200).json({ id: user.id, username: user.username });
};

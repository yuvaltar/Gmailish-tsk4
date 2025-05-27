const { createUser, getUserById } = require('../models/user');

function isValidDate(dateStr) {
  // Check format YYYY-MM-DD using regex
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;

  // Try creating a Date object
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

// POST /api/users
exports.registerUser = (req, res) => {
  const { firstName, lastName, username, gender, password, birthdate } = req.body;

   if (!firstName || !lastName || !username || !gender || !password || !birthdate) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!isValidDate(birthdate)) {
    return res.status(400).json({ error: 'Birthdate must be in YYYY-MM-DD format' });
  }

  const newUser = createUser({ firstName, lastName, username, gender, password, birthdate });
  if (!newUser) {
    return res.status(409).json({ error: 'Username already exists' });
  }

  res.status(201).json({ id: newUser.id, username: newUser.username });
};

// GET /api/users/:id
exports.getUser = (req, res) => {
  const user = getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { id, firstName, lastName, username, gender, birthdate } = user;
  res.status(200).json({ id, firstName, lastName, username, gender, birthdate });
};

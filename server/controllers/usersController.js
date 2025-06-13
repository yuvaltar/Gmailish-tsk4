const { createUser, getUserById } = require('../models/user');

function isValidDate(dateStr) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

// POST /api/users
exports.registerUser = (req, res) => {
  const { firstName, lastName, username, gender, password, birthdate } = req.body;
  const picture = req.file;

  if (!firstName || !lastName || !username || !gender || !password || !birthdate || !picture) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!isValidDate(birthdate)) {
    return res.status(400).json({ error: 'Birthdate must be in YYYY-MM-DD format' });
  }

  const newUser = createUser({ firstName, lastName, username, gender, password, birthdate, picturePath: picture.filename });

  if (!newUser) {
    return res.status(409).json({ error: 'Username already exists' });
  }

  console.log('Created user:', newUser);
  res.status(201).json(newUser);
};

// GET /api/users/:id
exports.getUser = (req, res) => {
  const user = getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { id, firstName, lastName, username, gender, birthdate, picture } = user;
  res.status(200).json({ id, firstName, lastName, username, gender, birthdate, picture });
};

// GET /api/users/by-email/:email
exports.getUserIdByEmail = (req, res) => {
  const { users } = require('../models/user');
  const email = decodeURIComponent(req.params.email).toLowerCase();

  const user = users.find(u => u.email.toLowerCase() === email);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ id: user.id });
};


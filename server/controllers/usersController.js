const path = require('path');
const fs = require('fs');
const { createUser, getUserById } = require('../models/user');

function isValidDate(dateStr) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;

  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

exports.registerUser = (req, res) => {
  const { firstName, lastName, username, gender, password, birthdate } = req.body;
  const picture = req.file;

  if (!firstName || !lastName || !username || !gender || !password || !birthdate || !picture) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!isValidDate(birthdate)) {
    return res.status(400).json({ error: 'Birthdate must be in YYYY-MM-DD format' });
  }

  const newUser = createUser({
    firstName,
    lastName,
    username,
    gender,
    password,
    birthdate,
    picturePath: picture.filename,
  });

  if (!newUser) {
    return res.status(409).json({ error: 'Username already exists' });
  }

  res.status(201).json(newUser);
};

exports.getUser = (req, res) => {
  const user = getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { id, firstName, lastName, username, gender, birthdate, picturePath } = user;
  res.status(200).json({ id, firstName, lastName, username, gender, birthdate, picturePath });
};

// ✅ NEW: Serve user's uploaded picture
exports.getUserPicture = (req, res) => {
  const user = getUserById(req.params.id);
  if (!user || !user.picturePath) {
    return res.status(404).json({ error: 'Picture not found' });
  }

  const imagePath = path.join(__dirname, '..', 'uploads', user.picturePath);
  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({ error: 'Picture file does not exist' });
  }

  res.sendFile(imagePath);
};

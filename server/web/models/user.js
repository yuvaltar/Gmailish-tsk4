const uuidv4 = require('../utils/uuid');
const users = [];

function createUser({ firstName, lastName, username, gender, password, birthdate }) {
  // Check for duplicate username
  if (users.some(user => user.username === username)) {
    return null; // Username already taken
  }

  const user = {
    id: uuidv4(),
    firstName,
    lastName,
    username,
    gender,
    password,
    birthdate
  };

  users.push(user);
  return user;
}

function getUserById(id) {
  return users.find(user => user.id === id);
}

function findUserByCredentials(username, password) {
  return users.find(user => user.username === username && user.password === password);
}

module.exports = { users, createUser, getUserById, findUserByCredentials };

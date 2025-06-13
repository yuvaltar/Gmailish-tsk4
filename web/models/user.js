const uuidv4 = require('../utils/uuid');
const users = [];

// Create a new user and add them to the in-memory array
function createUser({ firstName, lastName, username, gender, password, birthdate, picture }) {
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
    birthdate,
    picture 
  };

  users.push(user);
  return user;
}

// Find a user by their ID
function getUserById(id) {
  return users.find(user => user.id === id);
}

// Find a user by login credentials
function findUserByCredentials(username, password) {
  return users.find(user => user.username === username && user.password === password);
}

// Export everything
module.exports = { users, createUser, getUserById, findUserByCredentials };

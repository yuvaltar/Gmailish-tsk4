const { v4: uuidv4 } = require('uuid');

const users = [];

function createUser(username, password) {
  const user = { id: uuidv4(), username, password };
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

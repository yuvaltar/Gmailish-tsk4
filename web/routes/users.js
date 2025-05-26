const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// POST /api/users - register a new user
router.post('/', usersController.registerUser);

// GET /api/users/:id - fetch user info
router.get('/:id', usersController.getUser);

module.exports = router;

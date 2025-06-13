const auth = require('../middleware/auth');

const express = require('express');

const multer  = require('multer');
const upload  = multer({ dest: 'uploads/' });

const router = express.Router();
const usersController = require('../controllers/usersController');

// POST /api/users - register a new user

router.post('/', 
    upload.single('picture'),
    usersController.registerUser);


// GET /api/users/:id - fetch user info
router.get('/:id', usersController.getUser);

router.get("/by-email/:email", auth, usersController.getUserIdByEmail);

module.exports = router;

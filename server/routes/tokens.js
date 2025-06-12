

const express         = require("express");
const { login }       = require("../controllers/tokenController");

const router = express.Router();

// POST /api/tokens — authenticate and receive a JWT
router.post("/", login);

module.exports = router;

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const tokenController = require("../controllers/tokenController");

router.post("/", tokenController.login);
router.get("/me", auth, tokenController.getCurrentUser);

module.exports = router;

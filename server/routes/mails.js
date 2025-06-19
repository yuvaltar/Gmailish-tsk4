// routes/mails.js
const express = require('express');
const router = express.Router();
const mailsController = require('../controllers/mailsController');
const authenticate = require('../middleware/auth');

router.use(authenticate);

// GET /api/mails         → inbox (excludes spam)
router.get('/', mailsController.getInbox);

// GET /api/mails/spam    → list all spam
router.get('/spam', mailsController.getSpam);

// POST /api/mails/:id/spam → mark mail as spam and blacklist its URLs
router.post('/:id/spam', mailsController.markAsSpam);

// POST /api/mails        → send a new mail
router.post('/', mailsController.sendMail);

// GET /api/mails/search/:query → search mails
router.get('/search/:query', mailsController.searchMails);

router.get('/search/:label/:query', mailsController.searchMailsByLabel);


// GET /api/mails/:id     → get specific mail
router.get('/:id', mailsController.getMailById);

// PATCH /api/mails/:id   → edit mail
router.patch('/:id', mailsController.updateMail);

// PATCH /api/mails/:id/label → add a custom label
router.patch('/:id/label', mailsController.addLabelToEmail);

router.patch("/:id/star", authenticate, mailsController.toggleStar);

// DELETE /api/mails/:id  → delete mail
router.delete('/:id', mailsController.deleteMail);



module.exports = router;

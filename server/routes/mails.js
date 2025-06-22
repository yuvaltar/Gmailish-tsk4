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
router.post('/:id/spam', mailsController.toggleSpam);

// DRAFT
router.post('/draft', mailsController.saveDraft);

// POST /api/mails        → send a new mail
router.post('/', mailsController.sendMail);

// GET /api/mails/search/:query → search mails
router.get('/search/:query', mailsController.searchMails);

// GET /api/mails/search/:label/:query → search mails by label
router.get('/search/:label/:query', mailsController.searchMailsByLabel);

// GET /api/mails/:id     → get specific mail
router.get('/:id', mailsController.getMailById);

// DELETE /api/mails/:id/label/:label → remove a label from mail
router.delete('/:id/label/:label', mailsController.removeLabelFromEmail);

// DELETE /api/mails/:id  → delete mail
router.delete('/:id', mailsController.deleteMail);

router.delete('/trash/clear', mailsController.clearTrash);

// PATCH /api/mails/:id/label → add a custom label
router.patch('/:id/label', mailsController.addLabelToEmail);

// PATCH /api/mails/markAllRead → mark all mails as read
router.patch('/markAllRead', mailsController.markAllAsRead);

router.patch('/markUnread', mailsController.markAsUnread);


// PATCH /api/mails/:id/read → mark single mail as read
router.patch('/:id/read', mailsController.markAsRead);

// PATCH /api/mails/:id/star → toggle star
router.patch('/:id/star', mailsController.toggleStar);

// PATCH /api/mails/:id → edit mail
router.patch('/:id', mailsController.updateMail);


module.exports = router;

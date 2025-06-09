const express = require('express');
const router = express.Router();
const mailsController = require('../controllers/mailsController');
const { authenticate } = require('../middlewares/auth');
router.use(authenticate); 

// All mail routes require authentication
// meaning: he who calls /api/mails, must use requireAuth and pass it
router.use(requireAuth);
// if and only if i pass auth.js i can continie to the (get,post,pach,delete)
// GET /api/mails - get 50 most recent mails
router.get('/', mailsController.getInbox);

// POST /api/mails - send a new mail
router.post('/', mailsController.sendMail);

// GET /api/mails/:id - get specific mail
router.get('/:id', mailsController.getMailById);

// PATCH /api/mails/:id - edit mail
router.patch('/:id', mailsController.updateMail);

// DELETE /api/mails/:id - delete mail
router.delete('/:id', mailsController.deleteMail);

// GET /api/mails/search/:query - search mails
router.get('/search/:query', mailsController.searchMails);

module.exports = router;

// optional - if i only want post to use auth.js
// router.post('/', requireAuth, mailsController.sendMail);
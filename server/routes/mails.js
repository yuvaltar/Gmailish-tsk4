const express = require('express');
const router = express.Router();
const mailsController = require('../controllers/mailsController');

const authenticate = require('../middleware/auth');
router.use(authenticate); 


// GET /api/mails - get 50 most recent mails
router.get('/', mailsController.getInbox);

// POST /api/mails - send a new mail
router.post('/', mailsController.sendMail);
// GET /api/mails/search/:query - search mails
router.get('/search/:query', mailsController.searchMails);

// GET /api/mails/:id - get specific mail
router.get('/:id', mailsController.getMailById);

// PATCH /api/mails/:id - edit mail
router.patch('/:id', mailsController.updateMail);

// route to assign a label to an email

router.patch('/:id/label', mailsController.addLabelToEmail);

// DELETE /api/mails/:id - delete mail
router.delete('/:id', mailsController.deleteMail);



module.exports = router;


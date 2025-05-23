const { createMail, getMailById, deleteMailById, getInboxForUser, searchMails } = require('../models/mail');
const { users } = require('../models/user');
const { sendToCpp } = require('../services/blacklistService');

// POST /api/mails
exports.sendMail = async (req, res) => {
  const { to, subject, content } = req.body;
  const sender = req.user;

  if (!to || !subject || !content) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const recipient = users.find(u => u.id === to);
  if (!recipient) {
    return res.status(400).json({ error: 'Recipient does not exist' });
  }

  // Check for blacklisted URLs
  const urls = content.match(/\bhttps?:\/\/[^\s]+/g) || [];
  for (const url of urls) {
    const result = await sendToCpp(`GET ${url}`);
    if (result === '200 Ok') continue; // Not blacklisted
    if (result === '404 Not Found') return res.status(400).json({ error: 'URL is blacklisted' });
  }

  const mail = createMail(sender.id, to, subject, content);
  res.status(201).json(mail);
};

// GET /api/mails
exports.getInbox = (req, res) => {
  const userId = req.user.id;
  const inbox = getInboxForUser(userId);
  res.status(200).json(inbox);
};

// GET /api/mails/:id
exports.getMailById = (req, res) => {
  const mail = getMailById(req.params.id);
  if (!mail || (mail.senderId !== req.user.id && mail.recipientId !== req.user.id)) {
    return res.status(404).json({ error: 'Mail not found' });
  }
  res.status(200).json(mail);
};

// PATCH /api/mails/:id
exports.updateMail = (req, res) => {
  const mail = getMailById(req.params.id);
  if (!mail || mail.senderId !== req.user.id) {
    return res.status(404).json({ error: 'Mail not found or not owned by you' });
  }

  const { subject, content } = req.body;
  if (subject) mail.subject = subject;
  if (content) mail.content = content;
  res.status(204).end();
};

// DELETE /api/mails/:id
exports.deleteMail = (req, res) => {
  const mail = getMailById(req.params.id);
  if (!mail || mail.senderId !== req.user.id) {
    return res.status(404).json({ error: 'Mail not found or not owned by you' });
  }

  deleteMailById(req.params.id);
  res.status(204).end();
};

// GET /api/mails/search/:query
exports.searchMails = (req, res) => {
  const query = req.params.query;
  const userId = req.user.id;
  const results = searchMails(userId, query);
  res.status(200).json(results);
};

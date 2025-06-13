const {
  createMail,
  getMailById,
  deleteMailById,
  getInboxForUser,
  searchMails
} = require('../models/mail');
const { mails } = require ('../models/mail');
const { users } = require('../models/user');
const uuidv4 = require('../utils/uuid');
const { sendToCpp } = require('../services/blacklistService');

// Helper function to check blacklisted URLs in given text
async function containsBlacklistedUrl(text) {
  const urls = text.match(/\bhttps?:\/\/[^\s]+/g) || [];
  for (const url of urls) {
    const result = await sendToCpp(`GET ${url}`);

    if (result.startsWith('200 Ok')) {
      const lines = result.split('\n');
      const flags = lines.slice(1).join(' ').trim();
      if (flags === 'true true') {
        return { blacklisted: true, url };
      }
    } else if (result.startsWith('404 Not Found')) {
      return { blacklisted: true, url };
    } else {
      return { error: true, url };
    }
  }
  return { blacklisted: false };
}

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

  const check = await containsBlacklistedUrl(`${subject} ${content}`);
  if (check.error) {
    return res.status(500).json({ error: `Unexpected response from C++ server for ${check.url}` });
  }
  if (check.blacklisted) {
    return res.status(400).json({ error: `URL is blacklisted: ${check.url}` });
  }

  const mail = {
  id: uuidv4(),
  senderId: sender.id,
  senderName: `${sender.firstName} ${sender.lastName}`,
  recipientId: to,
  recipientName: `${recipient.firstName} ${recipient.lastName}`,
  subject: subject.trim(),
  content: content.trim(),
  timestamp: new Date().toISOString(),
  labels: ["sent"] 
};

  mails.push(mail)
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
exports.updateMail = async (req, res) => {
  const mail = getMailById(req.params.id);
  if (!mail || mail.senderId !== req.user.id) {
    return res.status(404).json({ error: 'Mail not found or not owned by you' });
  }

  const { subject, content } = req.body;

  const textToCheck = `${subject || ''} ${content || ''}`;
  const check = await containsBlacklistedUrl(textToCheck);
  if (check.error) {
    return res.status(500).json({ error: `Unexpected response from C++ server for ${check.url}` });
  }
  if (check.blacklisted) {
    return res.status(400).json({ error: `URL is blacklisted: ${check.url}` });
  }

  if (subject) mail.subject = subject.trim();
  if (content) mail.content = content.trim();
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

exports.addLabelToEmail = (req, res) => {
  const mailId = req.params.id;
  const { label } = req.body;

  if (!label || typeof label !== "string" || !label.trim()) {
    return res.status(400).json({ error: "Label must be a non-empty string" });
  }

  const mail = getMailById(mailId);
  if (!mail) {
    return res.status(404).json({ error: "Email not found" });
  }

  // Only the sender or recipient can modify labels
  const userId = req.user.id;
  if (mail.senderId !== userId && mail.recipientId !== userId) {
    return res.status(403).json({ error: "You are not authorized to label this email" });
  }

  if (!mail.labels) {
    mail.labels = [];
  }

  if (!mail.labels.includes(label)) {
    mail.labels.push(label);
  }

  res.status(200).json({ message: `Label '${label}' added`, mail });
};

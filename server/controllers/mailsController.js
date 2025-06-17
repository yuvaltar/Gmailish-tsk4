// controllers/mailsController.js
const {
  mails,
  createMail,
  getMailById,
  deleteMailById,
  getInboxForUser,
  searchMails,
  getEmailsByLabelName
} = require('../models/mail');
const { users } = require('../models/user');
const uuidv4 = require('../utils/uuid');
const { sendToCpp } = require('../services/blacklistService');

// Regex for robust URL matching (based on C++ URL regex)
const URL_REGEX = /(?:(?:file:\/\/(?:[A-Za-z]:)?(?:\/[^\s]*)?)|(?:[A-Za-z][A-Za-z0-9+.\-]*:\/\/)?(?:localhost|(?:[A-Za-z0-9-]+\.)+[A-Za-z0-9-]+|(?:\d{1,3}\.){3}\d{1,3})(?::\d+)?(?:\/[^\s]*)?)/g;

// Helper to detect blacklisted URLs for send/edit flows
async function containsBlacklistedUrl(text) {
  // extract all matches using matchAll
  const matches = Array.from(text.matchAll(URL_REGEX), m => m[0]);
  for (const url of matches) {
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

// POST /api/mails/:id/spam ⇒ mark mail as spam + blacklist its URLs
exports.markAsSpam = async (req, res) => {
  const mail = getMailById(req.params.id);
  if (!mail || (mail.senderId !== req.user.id && mail.recipientId !== req.user.id)) {
    return res.status(404).json({ error: 'Mail not found or not owned by you' });
  }

  const text = `${mail.subject} ${mail.content}`;
  const matches = Array.from(text.matchAll(URL_REGEX), m => m[0]);
  for (const url of matches) {
    const result = (await sendToCpp(`POST ${url}`)).trim();
    if (!['201 Created', '409 Conflict'].includes(result)) {
      return res.status(500).json({ error: `Failed to blacklist ${url}: ${result}` });
    }
  }

  if (!mail.labels.includes('spam')) mail.labels.push('spam');
  res.status(200).json({ message: 'Marked as spam', mail });
};

// GET /api/mails/spam ⇒ list spam mails
exports.getSpam = (req, res) => {
  const userId = req.user.id;
  const spamMails = getEmailsByLabelName('spam', userId);
  res.status(200).json(spamMails);
};

// GET /api/mails ⇒ inbox (excludes spam)
exports.getInbox = (req, res) => {
  const userId = req.user.id;
  let inbox = getInboxForUser(userId);
  inbox = inbox.filter(m => !m.labels.includes('spam'));
  res.status(200).json(inbox);
};

// POST /api/mails ⇒ send new mail (runs blacklist check)
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
    labels: ['sent']
  };

  mails.push(mail);
  res.status(201).json(mail);
};

// GET /api/mails/:id ⇒ fetch a single mail
exports.getMailById = (req, res) => {
  const mail = getMailById(req.params.id);
  if (!mail || (mail.senderId !== req.user.id && mail.recipientId !== req.user.id)) {
    return res.status(404).json({ error: 'Mail not found' });
  }
  res.status(200).json(mail);
};

// PATCH /api/mails/:id ⇒ update mail (runs blacklist check)
exports.updateMail = async (req, res) => {
  const mail = getMailById(req.params.id);
  if (!mail || mail.senderId !== req.user.id) {
    return res.status(404).json({ error: 'Mail not found or not owned by you' });
  }

  const { subject, content } = req.body;
  const check = await containsBlacklistedUrl(`${subject || ''} ${content || ''}`);
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

// DELETE /api/mails/:id ⇒ delete mail
exports.deleteMail = (req, res) => {
  const mail = getMailById(req.params.id);
  if (!mail || (mail.senderId !== req.user.id && mail.recipientId !== req.user.id)) {
    return res.status(404).json({ error: 'Mail not found or not owned by you' });
  }
  deleteMailById(req.params.id);
  res.status(204).end();
};

// GET /api/mails/search/:query ⇒ search mails
exports.searchMails = (req, res) => {
  const query = req.params.query;
  const userId = req.user.id;
  const results = searchMails(userId, query);
  res.status(200).json(results);
};

// PATCH /api/mails/:id/markRead
exports.markMailAsRead = (req, res) => {
  
  const mail = getMailById(req.params.id);
  // Only the recipient can mark as read
  if (!mail || mail.recipientId !== req.user.id) {
    return res.status(404).json({ error: 'Mail not found or not owned by you' });
  }
  mail.read = true;
  res.status(200).json({ message: 'Mail marked as read', mail });
};



// PATCH /api/mails/:id/label ⇒ add arbitrary label
exports.addLabelToEmail = (req, res) => {
  const mailId = req.params.id;
  const { label } = req.body;
  if (!label || typeof label !== 'string' || !label.trim()) {
    return res.status(400).json({ error: 'Label must be a non-empty string' });
  }

  const mailInst = getMailById(mailId);
  if (!mailInst) {
    return res.status(404).json({ error: 'Email not found' });
  }

  const userId = req.user.id;
  if (mailInst.senderId !== userId && mailInst.recipientId !== userId) {
    return res.status(403).json({ error: 'You are not authorized to label this email' });
  }

  if (!mailInst.labels) mailInst.labels = [];
  if (!mailInst.labels.includes(label)) mailInst.labels.push(label);

  res.status(200).json({ message: `Label '${label}' added`, mail: mailInst });
};

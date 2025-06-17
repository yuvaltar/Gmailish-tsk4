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
const { sendToCpp } = require('../services/blacklistService');

// Regex for robust URL matching
const URL_REGEX = /(?:(?:file:\/\/(?:[A-Za-z]:)?(?:\/[^\s]*)?)|(?:[A-Za-z][A-Za-z0-9+\.-]*:\/\/)?(?:localhost|(?:[A-Za-z0-9-]+\.)+[A-Za-z0-9-]+|(?:\d{1,3}\.){3}\d{1,3})(?::\d+)?(?:\/[^\s]*)?)/g;

// Helper to detect blacklisted URLs
async function containsBlacklistedUrl(text) {
  const matches = Array.from(text.matchAll(URL_REGEX), m => m[0]);
  for (const url of matches) {
    const result = await sendToCpp(`GET ${url}`);
    if (result.startsWith('200 Ok')) {
      const flags = result.split('\n').slice(1).join(' ').trim();
      if (flags === 'true true') {
        return { blacklisted: true, url };
      }
    } else if (result.startsWith('404 Not Found')) {
      continue;
    } else {
      return { error: true, url };
    }
  }
  return { blacklisted: false };
}

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
  return res.status(200).json({ message: 'Marked as spam', mail });
};

exports.getSpam = (req, res) => {
  const userId = req.user.id;
  const spamList = getEmailsByLabelName('spam', userId);
  return res.status(200).json(spamList);
};

exports.getInbox = (req, res) => {
  const userId = req.user.id;
  const label = req.query.label;

  if (label) {
    const list = getEmailsByLabelName(label, userId);
    return res.status(200).json(list);
  }

  let inbox = getInboxForUser(userId);
  inbox = inbox.filter(m => !m.labels.includes('spam'));
  return res.status(200).json(inbox);
};

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
    return res.status(500).json({ error: `Blacklist error for ${check.url}` });
  } else if (check.blacklisted) {
    return res.status(400).json({ error: `URL is blacklisted: ${check.url}` });
  }

  const { inboxMail, sentMail } = createMail(
    sender.id,
    to,
    subject.trim(),
    content.trim()
  );

  return res.status(201).json(sentMail);
};

exports.getMailById = (req, res) => {
  const mail = getMailById(req.params.id);
  if (!mail || (mail.senderId !== req.user.id && mail.recipientId !== req.user.id)) {
    return res.status(404).json({ error: 'Mail not found' });
  }
  return res.status(200).json(mail);
};

exports.updateMail = async (req, res) => {
  const mail = getMailById(req.params.id);
  if (!mail || mail.senderId !== req.user.id) {
    return res.status(404).json({ error: 'Mail not found or not owned by you' });
  }

  const { subject, content } = req.body;
  const check = await containsBlacklistedUrl(`${subject || ''} ${content || ''}`);
  if (check.error) {
    return res.status(500).json({ error: `Blacklist error for ${check.url}` });
  } else if (check.blacklisted) {
    return res.status(400).json({ error: `URL is blacklisted: ${check.url}` });
  }

  if (subject) mail.subject = subject.trim();
  if (content) mail.content = content.trim();
  return res.status(204).end();
};

exports.deleteMail = (req, res) => {
  const mail = getMailById(req.params.id);
  if (!mail || (mail.senderId !== req.user.id && mail.recipientId !== req.user.id)) {
    return res.status(404).json({ error: 'Mail not found or not owned by you' });
  }
  deleteMailById(req.params.id);
  return res.status(204).end();
};

exports.searchMails = (req, res) => {
  const userId = req.user.id;
  const query = req.params.query;
  const results = searchMails(userId, query);
  return res.status(200).json(results);
};

exports.markMailAsRead = (req, res) => {
  const mail = getMailById(req.params.id);
  if (!mail || mail.recipientId !== req.user.id) {
    return res.status(404).json({ error: 'Mail not found or not owned by you' });
  }
  mail.read = true;
  res.status(200).json({ message: 'Mail marked as read', mail });
};

exports.addLabelToEmail = (req, res) => {
  const mailId = req.params.id;
  const { label, action } = req.body;

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

  mailInst.labels = mailInst.labels || [];

  if (action === 'remove') {
    mailInst.labels = mailInst.labels.filter(l => l !== label);
  } else if (!mailInst.labels.includes(label)) {
    mailInst.labels.push(label);
  }

  return res.status(200).json({ message: `Label '${label}' ${action === 'remove' ? 'removed' : 'added'}`, mail: mailInst });
};
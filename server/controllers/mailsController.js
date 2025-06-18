// controllers/mailsController.js

const {
  mails,
  createMail,
  getMailById,
  deleteMailById,
  getInboxForUser,
  searchMails,

  getDraftsForUser
} = require('../models/mail');
const { mails } = require('../models/mail');
const { users } = require('../models/user');
const uuidv4 = require('../utils/uuid');
const { sendToCpp } = require('../services/blacklistService');

// Helper to check blacklisted URLs

  getEmailsByLabelName
} = require('../models/mail');


// Regex for robust URL matching
const URL_REGEX = /(?:(?:file:\/\/(?:[A-Za-z]:)?(?:\/[^\s]*)?)|(?:[A-Za-z][A-Za-z0-9+.\-]*:\/\/)?(?:localhost|(?:[A-Za-z0-9-]+\.)+[A-Za-z0-9-]+|(?:\d{1,3}\.){3}\d{1,3})(?::\d+)?(?:\/[^\s]*)?)/g;

/**
 * Helper to detect blacklisted URLs for send/edit flows
 */

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
      // safe
      continue;
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

  // Blacklist any URLs in subject+content
  const text = `${mail.subject} ${mail.content}`;
  const matches = Array.from(text.matchAll(URL_REGEX), m => m[0]);
  for (const url of matches) {
    const result = (await sendToCpp(`POST ${url}`)).trim();
    if (!['201 Created', '409 Conflict'].includes(result)) {
      return res.status(500).json({ error: `Failed to blacklist ${url}: ${result}` });
    }
  }

  // Add the spam label
  if (!mail.labels.includes('spam')) mail.labels.push('spam');
  return res.status(200).json({ message: 'Marked as spam', mail });
};

// GET /api/mails/spam ⇒ alias route for spam view
exports.getSpam = (req, res) => {
  const userId   = req.user.id;
  const spamList = getEmailsByLabelName('spam', userId);
  return res.status(200).json(spamList);
};

/**
 * GET /api/mails
 * - if ?label= is provided, return that folder
 * - otherwise return inbox (default)
 */
exports.getInbox = (req, res) => {
  const userId = req.user.id;
  const label  = req.query.label;

  if (label) {
    // any folder
    const list = getEmailsByLabelName(label, userId);
    return res.status(200).json(list);
  }

  // default inbox (exclude spam)
  let inbox = getInboxForUser(userId);
  inbox = inbox.filter(m => !m.labels.includes('spam'));
  return res.status(200).json(inbox);
};

// POST /api/mails ⇒ send new mail (with blacklist + dual-record creation)
exports.sendMail = async (req, res) => {
  const { to, subject, content } = req.body;
  const sender = req.user;
  if (!to || !subject || !content) return res.status(400).json({ error: 'Missing fields' });

  const recipient = users.find(u => u.id === to);
  if (!recipient) return res.status(400).json({ error: 'Recipient does not exist' });

  // Blacklist check
  const check = await containsBlacklistedUrl(`${subject} ${content}`);

  if (check.error) return res.status(500).json({ error: `Unexpected response from C++ server for ${check.url}` });
  if (check.blacklisted) return res.status(400).json({ error: `URL is blacklisted: ${check.url}` });

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

  mails.push(mail);
  res.status(201).json(mail);
};

// GET /api/mails
exports.getInbox = (req, res) => {
  const inbox = getInboxForUser(req.user.id);
  res.status(200).json(inbox);

};

// GET /api/mails/:id ⇒ fetch a single mail
exports.getMailById = (req, res) => {
  const mail = getMailById(req.params.id);
  if (!mail || (mail.senderId !== req.user.id && mail.recipientId !== req.user.id)) {
    return res.status(404).json({ error: 'Mail not found' });
  }
  return res.status(200).json(mail);
};

// PATCH /api/mails/:id ⇒ update mail (with blacklist check)
exports.updateMail = async (req, res) => {
  const mail = getMailById(req.params.id);
  if (!mail || mail.senderId !== req.user.id) return res.status(404).json({ error: 'Not found or unauthorized' });

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

// DELETE /api/mails/:id ⇒ delete mail
exports.deleteMail = (req, res) => {
  const mail = getMailById(req.params.id);

  if (!mail || (mail.senderId !== req.user.id && mail.recipientId !== req.user.id)) {
    return res.status(404).json({ error: 'Mail not found or not owned by you' });
  }

  deleteMailById(req.params.id);
  return res.status(204).end();
};

// GET /api/mails/search/:query ⇒ search mails
exports.searchMails = (req, res) => {

  const results = searchMails(req.user.id, req.params.query);
  res.status(200).json(results);
};

// GET /api/mails/drafts
exports.getDrafts = (req, res) => {
  const drafts = getDraftsForUser(req.user.id);
  res.status(200).json(drafts);
};

// POST /api/mails/drafts
exports.saveDraft = (req, res) => {
  const { to, subject, content } = req.body;
  const sender = req.user;

  if (!subject && !content && !to) return res.status(400).json({ error: 'Draft is empty' });

  let recipientId = null;
  let recipientName = null;

  if (to) {
    const recipient = users.find(u => u.email === to);
    if (recipient) {
      recipientId = recipient.id;
      recipientName = `${recipient.firstName} ${recipient.lastName}`;
    } else {
      recipientName = to; // fallback to raw email
    }
  }

  const mail = {
    id: uuidv4(),
    senderId: sender.id,
    senderName: `${sender.firstName} ${sender.lastName}`,
    recipientId,
    recipientName,
    subject: subject?.trim() || "",
    content: content?.trim() || "",
    timestamp: new Date().toISOString(),
    labels: ["draft"]
  };

  mails.push(mail);
  res.status(201).json(mail);
};

// PATCH /api/mails/:id/label

exports.addLabelToEmail = (req, res) => {
  const mail = getMailById(req.params.id);
  const { label, action } = req.body; // action = 'add' or 'remove'


  if (!label || typeof label !== "string" || !label.trim()) {
    return res.status(400).json({ error: "Invalid label" });
  }

  if (!mail) return res.status(404).json({ error: "Mail not found" });

  const userId = req.user.id;
  if (mail.senderId !== userId && mail.recipientId !== userId) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  if (!mail.labels) mail.labels = [];

  if (action === "remove") {
    mail.labels = mail.labels.filter(l => l !== label);
  } else {
    if (!mail.labels.includes(label)) {
      mail.labels.push(label);
    }
  }

  res.status(200).json({ message: `Label '${label}' ${action === "remove" ? "removed" : "added"}`, mail });

};

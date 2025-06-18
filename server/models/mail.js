// src/models/mail.js

const uuidv4 = require('../utils/uuid');
const { users } = require('./user');  // make sure this points at your in-memory users

// In-memory mail store
const mails = [];

/**
 * Create a mail record in both sender's "sent" and recipient's "inbox".
 * Returns { inboxMail, sentMail }
 */
function createMail(senderId, recipientId, subject, content) {
  const sender = users.find(u => u.id === senderId) || {};
  const recipient = users.find(u => u.id === recipientId) || {};
  const timestamp = new Date().toISOString();

  const senderName = sender.firstName && sender.lastName
    ? `${sender.firstName} ${sender.lastName}`
    : (sender.username || 'Unknown');

  const recipientName = recipient.firstName && recipient.lastName
    ? `${recipient.firstName} ${recipient.lastName}`
    : (recipient.username || 'Unknown');

  const inboxMail = {
    id: uuidv4(),
    senderId,
    senderName,
    recipientId,
    recipientName,
    subject: subject.trim(),
    content: content.trim(),
    timestamp,
    labels: ['inbox'],
  };

  const sentMail = {
    id: uuidv4(),
    senderId,
    senderName,
    recipientId,
    recipientName,
    subject: subject.trim(),
    content: content.trim(),
    timestamp,
    labels: ['sent'],
  };

  mails.push(inboxMail, sentMail);
  return { inboxMail, sentMail };
}

/**
 * Get a single mail by its ID.
 */
function getMailById(id) {
  return mails.find(m => m.id === id);
}

/**
 * Delete a mail by its ID.
 */
function deleteMailById(id) {
  const idx = mails.findIndex(m => m.id === id);
  if (idx !== -1) mails.splice(idx, 1);
}

/**
 * Get the latest 50 inbox mails for a given user (excluding drafts).
 */
function getInboxForUser(userId) {
  return mails
    .filter(m =>
      m.recipientId === userId &&
      !m.labels.includes('draft') &&
      !m.labels.includes('spam')
    )
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 50);
}

/**
 * Get all mails for a user with a given label name.
 * (works for 'sent', 'spam', 'trash', custom labels, etc.)
 */
function getEmailsByLabelName(labelName, userId) {
  return mails
    .filter(m =>
      m.labels.includes(labelName) &&
      (
        (labelName === 'sent' && m.senderId === userId) ||
        (labelName !== 'sent' && m.recipientId === userId)
      )
    )
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

/**
 * Get all draft mails for a user.
 */
function getDraftsForUser(userId) {
  return mails
    .filter(m =>
      m.senderId === userId &&
      m.labels.includes('draft')
    );
}

/**
 * Search mails by subject or content (or sender/recipient name) for a user.
 */
function searchMails(userId, query) {
  const q = query.toLowerCase();
  return mails.filter(m =>
    (m.senderId === userId || m.recipientId === userId) &&
    (
      (m.senderName && m.senderName.toLowerCase().includes(q)) ||
      (m.recipientName && m.recipientName.toLowerCase().includes(q)) ||
      (m.subject && m.subject.toLowerCase().includes(q)) ||
      (m.content && m.content.toLowerCase().includes(q))
    )
  );
}

module.exports = {
  mails,
  createMail,
  getMailById,
  deleteMailById,
  getInboxForUser,
  getEmailsByLabelName,
  getDraftsForUser,
  searchMails,
};

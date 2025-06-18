const uuidv4 = require('../utils/uuid');
const { users } = require('./user');  // Ensure this imports your user list

// In-memory storage of all mail records
const mails = [];

/**
 * Create a mail entry in both sender's "sent" and recipient's "inbox".
 * Returns an object with the two created mail records.
 */
function createMail(senderId, recipientId, subject, content) {
  const sender = users.find(u => u.id === senderId) || {};
  const recipient = users.find(u => u.id === recipientId) || {};
  const timestamp = new Date().toISOString();

  const senderName = sender.username || 'Unknown';
  const recipientName = recipient.username || 'Unknown';

  // Recipient's copy (inbox)
  const inboxMail = {
    id: uuidv4(),
    senderId,
    senderName,
    recipientId,
    recipientName,
    subject,
    content,
    timestamp,
    labels: ['inbox']
  };

  // Sender's copy (sent)
  const sentMail = {
    id: uuidv4(),
    senderId,
    senderName,
    recipientId,
    recipientName,
    subject,
    content,
<<<<<<< itay
    timestamp: new Date().toISOString(),
    labels: [],
=======
    timestamp,
    labels: ['sent']
>>>>>>> itay-yuval
  };

  // Store both copies
  mails.push(inboxMail, sentMail);

  return { inboxMail, sentMail };
}

/**
 * Find a mail by its ID.
 */
function getMailById(id) {
  return mails.find(m => m.id === id);
}

/**
 * Delete a mail record by its ID.
 */
function deleteMailById(id) {
  const idx = mails.findIndex(m => m.id === id);
  if (idx !== -1) mails.splice(idx, 1);
}

/**
 * Get up to the 50 newest inbox mails for a user.
 * Only includes mails received by the user (not sent by them).
 */
function getInboxForUser(userId) {
  return mails
<<<<<<< itay
    .filter(m => m.recipientId === userId && !(m.labels && m.labels.includes("draft")))
=======
    .filter(m => m.recipientId === userId && m.labels.includes('inbox'))
>>>>>>> itay-yuval
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 50);
}

/**
 * Get mails by any label (sent, spam, starred, custom, etc.).
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

<<<<<<< itay
function getDraftsForUser(userId) {
  return mails.filter(m =>
    m.senderId === userId &&
    (!m.labels || m.labels.includes("draft"))
  );
}

function getEmailsByLabelName(labelName, userId) {
  return mails.filter(email =>
    email.labels?.includes(labelName) &&
    (email.senderId === userId || email.recipientId === userId)
=======
/**
 * Search mails by subject or content for a user.
 * Searches both sent and received mails.
 */
function searchMails(userId, query) {
  const q = query.toLowerCase();
  return mails.filter(m =>
    (m.senderId === userId || m.recipientId === userId) && (
      (m.subject && m.subject.toLowerCase().includes(q)) ||
      (m.content && m.content.toLowerCase().includes(q))
    )
>>>>>>> itay-yuval
  );
}

module.exports = {
  mails,
  createMail,
  getMailById,
  deleteMailById,
  getInboxForUser,
<<<<<<< itay
  searchMails,
  getEmailsByLabelName,
  getDraftsForUser,
=======
  getEmailsByLabelName,
  searchMails
>>>>>>> itay-yuval
};

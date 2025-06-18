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
    timestamp,
    labels: ['sent']
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
    .filter(m => m.recipientId === userId && m.labels.includes('inbox'))
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
  );
}

/**
 * Toggle the 'starred' flag for a mail (if the user owns it).
 */
function toggleStar(mailId, userId) {
  const mail = mails.find(m => m.id === mailId);
  if (!mail || (mail.senderId !== userId && mail.recipientId !== userId)) {
    return null;
  }

  mail.starred = !mail.starred;

  // Handle 'starred' label logic
  mail.labels = mail.labels || [];
  if (mail.starred) {
    if (!mail.labels.includes('starred')) mail.labels.push('starred');
  } else {
    mail.labels = mail.labels.filter(label => label !== 'starred');
  }

  return mail.starred;
}


/**
 * Mark all inbox mails for the user as read (by adding 'read' label).
 */
function markAllAsRead(userId) {
  mails.forEach(mail => {
    if (mail.recipientId === userId && mail.labels.includes('inbox') && !mail.labels.includes('read')) {
      mail.labels.push('read');
    }
  });
}

module.exports = {
  mails,
  createMail,
  getMailById,
  deleteMailById,
  getInboxForUser,
  getEmailsByLabelName,
  searchMails,
  toggleStar,
  markAllAsRead
};

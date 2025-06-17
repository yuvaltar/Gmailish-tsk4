const uuidv4 = require('../utils/uuid');
const { users } = require('./user'); // 👈 make sure this is present

const mails = [];

function createMail(senderId, recipientId, subject, content) {
  const sender = users.find(u => u.id === senderId);
  const recipient = users.find(u => u.id === recipientId);

  const mail = {
    id: uuidv4(),
    senderId,
    senderName: sender ? `${sender.firstName} ${sender.lastName}` : "Unknown",
    recipientId,
    recipientName: recipient ? `${recipient.firstName} ${recipient.lastName}` : "Unknown",
    subject,
    content,
    timestamp: new Date().toISOString(),
    labels: [],
  };

  mails.push(mail);
  return mail;
}

function getMailById(id) {
  return mails.find(m => m.id === id);
}

function deleteMailById(id) {
  const index = mails.findIndex(m => m.id === id);
  if (index !== -1) mails.splice(index, 1);
}

function getInboxForUser(userId) {
  return mails
    .filter(m => m.recipientId === userId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 50);
}

function searchMails(userId, query) {
  return mails.filter(m =>
    (m.senderId === userId || m.recipientId === userId) &&
    (
      (m.senderName && m.senderName.includes(query)) ||
      (m.recipientName && m.recipientName.includes(query)) ||
      (m.subject && m.subject.includes(query)) ||
      (m.content && m.content.includes(query))
    )
  );
}

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
  );
}

module.exports = {
  mails,
  createMail,
  getMailById,
  deleteMailById,
  getInboxForUser,
  searchMails,
  getEmailsByLabelName,
  getDraftsForUser,
};

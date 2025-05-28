const uuidv4 = require('../utils/uuid');

const mails = [];

function createMail(senderId, recipientId, subject, content) {
  const mail = {
    id: uuidv4(),
    senderId,
    recipientId,
    subject,
    content,
    timestamp: new Date().toISOString(),
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
  return mails.filter(m => m.senderId === userId || m.recipientId === userId) //// include only user's mails
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))  //// sort from newest to oldest
              .slice(0, 50);                                                  // take the 50 most recent
}

function searchMails(userId, query) {
  return mails.filter(m =>
    (m.senderId === userId || m.recipientId === userId) &&
    Object.values(m).some(val => typeof val === 'string' && val.includes(query))
  );
}

module.exports = { mails, createMail, getMailById, deleteMailById, getInboxForUser, searchMails };

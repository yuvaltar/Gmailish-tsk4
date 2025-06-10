import React, { useEffect, useState } from "react";
import { Card, Spinner, Alert, Button } from "react-bootstrap";

// Mock database of email content
const mockEmailDatabase = [
  {
    id: '1',
    senderId: 'Google Photos',
    recipientId: 'you@example.com',
    subject: 'A new highlight video for you',
    content: 'We\'ve created a new video for you based on your recent photos. We hope you enjoy looking back at your memories.',
    timestamp: new Date(2025, 5, 10, 10, 44, 0).toISOString(),
  },
  {
    id: '2',
    senderId: 'GitHub',
    recipientId: 'you@example.com',
    subject: '[GitHub] A personal access token was added to your account',
    content: 'A new personal access token (classic) with the "public_repo" scope was recently added to your account. Visit your settings to review.',
    timestamp: new Date(2025, 5, 9, 11, 20, 0).toISOString(),
  },
  {
    id: '3',
    senderId: 'Figma',
    recipientId: 'you@example.com',
    subject: 'Your weekly team updates and new files',
    content: 'Here\'s a summary of what your team has been up to this week. There are 5 new files and 23 comments waiting for you.',
    timestamp: new Date(2025, 5, 8, 16, 5, 0).toISOString(),
  },
];

function MailView({ emailId, onBack }) {
  const [mailData, setMailData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset state when emailId changes
    setMailData(null);
    setError(null);

    if (!emailId) return;

    // Simulate fetching from the mock database
    const foundEmail = mockEmailDatabase.find(email => email.id === emailId);

    // Simulate a network delay
    setTimeout(() => {
        if (foundEmail) {
            setMailData(foundEmail);
        } else {
            setError("Email not found in our mock database.");
        }
    }, 300); // 300ms delay

  }, [emailId]);

  if (error) return <Alert variant="danger" className="m-3">Error: {error}</Alert>;
  if (!mailData) return <div className="d-flex justify-content-center align-items-center h-100"><Spinner animation="border" /></div>;

  return (
    <div className="p-3">
        <Button variant="light" onClick={onBack} className="mb-3 border">
          &larr; Back to Inbox
        </Button>
        <Card>
            <Card.Header>
                <strong>From:</strong> {mailData.senderId}<br />
                <strong>To:</strong> {mailData.recipientId}<br />
                <strong>Subject:</strong> {mailData.subject}<br />
            </Card.Header>
            <Card.Body>
                <p>{mailData.content}</p>
            </Card.Body>
        </Card>
    </div>
  );
}

export default MailView;

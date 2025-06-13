import React, { useEffect, useState } from "react";
import { Card, Spinner, Alert, Button } from "react-bootstrap";

function MailView({ emailId, onBack }) {
  const [mailData, setMailData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setMailData(null);
    setError(null);

    if (!emailId) return;

    const fetchMail = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/mails/${emailId}`, {
          credentials: "include"
        });

        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error || "Mail not found");
        }

        const mail = await res.json();
        setMailData(mail);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMail();
  }, [emailId]);

  if (error) {
    return <Alert variant="danger" className="m-3">Error: {error}</Alert>;
  }

  if (!mailData) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="p-3">
      <Button variant="light" onClick={onBack} className="mb-3 border">
        &larr; Back to Inbox
      </Button>
      <Card>
        <Card.Header>
          <strong>From:</strong> {mailData.senderName || mailData.senderId}<br />
          <strong>To:</strong> {mailData.recipientName || mailData.recipientId}<br />
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

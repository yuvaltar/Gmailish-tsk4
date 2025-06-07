import React, { useEffect, useState } from "react";
import { Card, Spinner, Alert } from "react-bootstrap";

function MailView({ email: emailId }) {
  const [mailData, setMailData] = useState(null); // will hold the email details
  const [error, setError] = useState(null);        // if fetch fails

  useEffect(() => {
    if (!emailId) return;

    // Fetch email by ID from the backend
    const fetchEmail = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/mails/${emailId}`, {
          headers: {
            "X-User-Id": localStorage.getItem("userId") // server expects X-User-Id header
          }
        });

        if (!response.ok) throw new Error("Failed to fetch email");
        const data = await response.json();
        setMailData(data); // store email data in state
      } catch (err) {
        setError(err.message);
      }
    };

    fetchEmail();
  }, [emailId]); // runs every time emailId changes

  if (error) return <Alert variant="danger">Error: {error}</Alert>;
  if (!mailData) return <Spinner animation="border" />;

  return (
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
  );
}

export default MailView;

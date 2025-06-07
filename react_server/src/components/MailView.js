import React, { useEffect, useState } from "react";
import { Card, Spinner, Alert } from "react-bootstrap";

function MailView({ email: emailId }) {
  const [mailData, setMailData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!emailId) return;

    const fetchEmail = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/mails/${emailId}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}` // JWT from login
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch email");
        }

        const data = await response.json();
        setMailData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchEmail();
  }, [emailId]);

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

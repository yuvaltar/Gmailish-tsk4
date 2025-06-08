import React, { useEffect, useState } from "react";
import { Card, Spinner, Alert } from "react-bootstrap";

// fallback mock data
const mockMail = {
  id: 1,
  senderId: "admin@gmail.com",
  recipientId: "user@gmail.com",
  subject: "Welcome!",
  content: "Hello and welcome to Gmailish!",
};

function MailView({ email: emailId }) {
  const [mailData, setMailData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!emailId) return;
    const fetchEmail = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/mails/${emailId}`, {
          headers: {
            "X-User-Id": localStorage.getItem("userId") || "demo"
          }
        });
        if (!response.ok) throw new Error("Failed to fetch email");
        const data = await response.json();
        setMailData(data);
      } catch (err) {
        setMailData(mockMail);
        setError("Showing mock email (backend not available)");
      }
    };
    fetchEmail();
  }, [emailId]);

  if (!emailId) return <div>Select an email to view</div>;
  if (error) return <Alert variant="warning">{error}</Alert>;
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

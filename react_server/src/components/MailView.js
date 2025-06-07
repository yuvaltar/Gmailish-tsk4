import React from "react";
import { Card, Alert } from "react-bootstrap";

function MailView({ email }) {
  if (!email) {
    return <Alert variant="info">No email selected</Alert>;
  }

  return (
    <Card>
      <Card.Header>
        <strong>From:</strong> {email.from}<br />
        <strong>Subject:</strong> {email.subject}<br />
        <strong>Date:</strong> {email.date}
      </Card.Header>
      <Card.Body>
        <p>{email.body}</p>
      </Card.Body>
    </Card>
  );
}

export default MailView;

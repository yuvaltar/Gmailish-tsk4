import React, { useState } from "react";
import { Alert } from "react-bootstrap";

function SendMail() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    setError("");
    setSent(false);

    if (!to || !subject || !body) {
      setError("All fields are required.");
      return;
    }
    try {
      const res = await fetch("http://localhost:3000/api/mails", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          to,
          subject,
          content: body,
        }),
      });
      if (!res.ok) throw new Error("Failed to send email.");
      setSent(true);
      setTo("");
      setSubject("");
      setBody("");
    } catch (err) {
      setError("Failed to send email.");
    }
  };

  return (
    <form onSubmit={handleSend}>
      {sent && <Alert variant="success">Email sent!</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <input
        type="email"
        placeholder="To"
        className="form-control mb-2"
        value={to}
        onChange={e => setTo(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Subject"
        className="form-control mb-2"
        value={subject}
        onChange={e => setSubject(e.target.value)}
        required
      />
      <textarea
        placeholder="Body"
        className="form-control mb-2"
        value={body}
        onChange={e => setBody(e.target.value)}
        required
      />
      <button className="btn btn-primary" type="submit">Send</button>
    </form>
  );
}

export default SendMail;

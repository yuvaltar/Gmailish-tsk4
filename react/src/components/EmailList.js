// React core hooks
import React, { useState, useEffect } from "react";
import { Table, Spinner, Alert } from "react-bootstrap";

// fallback mock data
const mockEmails = [
  { id: 1, senderId: "admin@gmail.com", subject: "Welcome!", timestamp: Date.now() },
  { id: 2, senderId: "team@gmail.com", subject: "React Project", timestamp: Date.now() - 86400000 },
];

function EmailList({ setSelectedEmail }) {
  // useState to store emails fetched from the backend
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // useEffect runs once when the component loads
  useEffect(() => {
    // Try to fetch from backend, fallback to mock
    const fetchEmails = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch("http://localhost:3000/api/mails", {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Failed to fetch mails");
        const data = await res.json();
        setEmails(data);
      } catch (err) {
        setEmails(mockEmails);
        setError("Showing mock emails (backend not available)");
      } finally {
        setLoading(false);
      }
    };
    fetchEmails();
  }, []);

  if (loading) return <Spinner animation="border" />;
  return (
    <div className="w-100 p-3">
      <h3>Inbox</h3>
      {error && <Alert variant="warning">{error}</Alert>}
      <Table hover>
        <tbody>
          {emails.map((email) => (
            <tr
              key={email.id}
              onClick={() => setSelectedEmail && setSelectedEmail(email.id)}
              style={{ cursor: "pointer" }}
            >
              <td><strong>{email.senderId}</strong></td>
              <td>{email.subject}</td>
              <td className="text-end">{new Date(email.timestamp).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default EmailList;

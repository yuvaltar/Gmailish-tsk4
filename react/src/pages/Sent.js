//sent.js
import React, { useEffect, useState } from "react";

function Sent() {
  const [sentEmails, setSentEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSentEmails = async () => {
      try {
        const res = await fetch("/api/labels/sent/emails", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch sent emails");
        }

        const data = await res.json();
        setSentEmails(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchSentEmails();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Sent Emails</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && sentEmails.length === 0 && (
        <p>You haven't sent any emails yet.</p>
      )}

      <ul className="list-group">
        {sentEmails.map((email) => (
          <li key={email.id} className="list-group-item">
            <strong>To:</strong> {email.recipientName} <br />
            <strong>Subject:</strong> {email.subject} <br />
            <small className="text-muted">{new Date(email.timestamp).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sent;

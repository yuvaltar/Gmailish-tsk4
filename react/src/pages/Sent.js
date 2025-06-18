import React, { useEffect, useState } from "react";
import EmailList from "../components/EmailList";
import MailView from "../components/MailView";
import { Spinner, Alert } from "react-bootstrap";

function Sent() {
  const [emails, setEmails] = useState([]);
  const [selectedEmailId, setSelectedEmailId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSentEmails = async () => {
      try {
        const res = await fetch("api/labels/sent/emails", {
          credentials: "include"
        });
        if (!res.ok) throw new Error("Failed to load sent emails");
        const data = await res.json();
        setEmails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSentEmails();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">Error: {error}</Alert>;
  }

  return (
    <div className="p-3">
      <h2 className="mb-4">📤 Sent Mail</h2>
      {selectedEmailId ? (
        <MailView emailId={selectedEmailId} onBack={() => setSelectedEmailId(null)} />
      ) : (
        <EmailList emails={emails} setSelectedEmail={setSelectedEmailId} />
      )}
    </div>
  );
}

export default Sent;

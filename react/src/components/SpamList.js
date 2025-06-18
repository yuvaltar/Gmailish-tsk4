// react/src/pages/SpamList.js
import React, { useEffect, useState } from 'react';
import EmailList from '../components/EmailList';  // adjust path if yours is different
import { Spinner, Alert } from 'react-bootstrap';

export default function SpamList() {
  const [mails, setMails]     = useState(null);
  const [error, setError]     = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/mails/spam', {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => setMails(data))
      .catch(err => setError(err.message));
  }, []);

  if (error) {
    return <Alert variant="danger" className="m-3">Error loading spam: {error}</Alert>;
  }
  if (mails === null) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="p-3">
      <h2>Spam</h2>
      <EmailList emails={mails} />
    </div>
  );
}

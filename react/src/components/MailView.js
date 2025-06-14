import React, { useEffect, useState } from "react";
import { Card, Spinner, Alert } from "react-bootstrap";
import { BsArrowLeft, BsArchive, BsExclamationCircle, BsTrash, BsStar, BsTag }
from "react-icons/bs";


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

  const handleArchive = () => console.log("Archive clicked");
  const handleSpam = () => console.log("Mark as spam clicked");
  const handleDelete = () => console.log("Delete clicked");
  const handleStar = () => console.log("Star clicked");
  const handleLabel = () => console.log("Label clicked");

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
    <div className="p-3 mail-view-container">
      {/* Gmail-style top toolbar */}
      <div className="mail-toolbar d-flex align-items-center gap-2 mb-3">
      <button className="gmail-icon-btn" onClick={onBack} title="Back to Inbox">
        <BsArrowLeft size={18} />
      </button>
      <button className="gmail-icon-btn" onClick={handleArchive} title="Archive">
        <BsArchive size={18} />
      </button>
      <button className="gmail-icon-btn" onClick={handleSpam} title="Report spam">
        <BsExclamationCircle size={18} />
      </button>
      <button className="gmail-icon-btn" onClick={handleDelete} title="Delete">
        <BsTrash size={18} />
      </button>
      <button className="gmail-icon-btn" onClick={handleStar} title="Star">
        <BsStar size={18} />
      </button>
      <button className="gmail-icon-btn" onClick={handleLabel} title="Label">
        <BsTag size={18} />
      </button>
    </div>


      {/* Email Content */}
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

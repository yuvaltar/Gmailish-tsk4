import React, { useEffect, useState } from "react";
import { Card, Spinner, Alert } from "react-bootstrap";
import { BsArrowLeft, BsArchive, BsExclamationCircle, BsTrash, BsStar, BsTag } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

function MailView({ emailId, onBack }) {
  const [mailData, setMailData] = useState(null);
  const [error, setError] = useState(null);
  const [showLabels, setShowLabels] = useState(false);
  const [labels, setLabels] = useState([]);
  const navigate = useNavigate();

  // Fetch the mail data
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

  // Fetch available labels (system + custom) on mount
  useEffect(() => {
    fetch("http://localhost:3000/api/labels", { credentials: "include" })
      .then(res => res.json())
      .then(setLabels)
      .catch(() => setLabels([]));
  }, []);

  // Toolbar action handlers
  const handleArchive = async () => {
    await updateLabel("archive");
    navigate("/archive");
  };

  const handleSpam = async () => {
    await updateLabel("spam");
    navigate("/spam");
  };

  const handleDelete = async () => {
    await updateLabel("trash");
    navigate("/trash");
  };

  const handleStar = async () => {
    await updateLabel("starred");
    navigate("/starred");
  };

  const handleLabel = () => setShowLabels(show => !show);

  const handleSelectLabel = async (label) => {
    await updateLabel(label);
    setShowLabels(false);
    navigate(`/labels/${encodeURIComponent(label)}`);
  };

  // Helper to add a label to this mail
  const updateLabel = async (label) => {
    try {
      await fetch(`http://localhost:3000/api/mails/${emailId}/labels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ label }),
      });
    } catch (err) {
      alert("Failed to update label: " + err.message);
    }
  };

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
    <div className="p-3 mail-view-container" style={{ position: "relative" }}>
      {/* Gmail-style top toolbar */}
      <div className="mail-toolbar d-flex align-items-center gap-2 mb-3">

      <button className="gmail-icon-btn" onClick={onBack} title="Back to Inbox">
        <BsArrowLeft size={18} />
      </button>
      <button className="gmail-icon-btn" onClick={handleArchive} title="Archive">
        <BsArchive size={18} />
      </button>
      <button className="gmail-icon-btn" onClick={handleLabel} title="Label">
        <BsTag size={18} />
      </button>
      <button className="gmail-icon-btn" onClick={handleStar} title="Star">
        <BsStar size={18} />
      </button>
       <button className="gmail-icon-btn" onClick={handleSpam} title="Report spam">
        <BsExclamationCircle size={18} />
      </button>
      <button className="gmail-icon-btn" onClick={handleDelete} title="Delete">
        <BsTrash size={18} />
      </button>
    </div>


      {/* Label Picker Dropdown */}
      {showLabels && (
        <div
          style={{
            position: "absolute",
            top: 50,
            left: 120,
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 4,
            zIndex: 10,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}
        >
          {labels.length === 0 ? (
            <div style={{ padding: "1rem" }}>No labels</div>
          ) : (
            labels.map(l => (
              <div
                key={l.name}
                className="label-picker-item"
                onClick={() => handleSelectLabel(l.name)}
                style={{
                  cursor: "pointer",
                  padding: "0.5rem 1.5rem",
                  borderBottom: "1px solid #eee"
                }}
              >
                {l.name}
              </div>
            ))
          )}
        </div>
      )}

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
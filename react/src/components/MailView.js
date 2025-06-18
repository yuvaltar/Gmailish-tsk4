// src/components/MailView.js
import React, { useEffect, useState } from "react";
<<<<<<< itay
import { Spinner, Alert } from "react-bootstrap";
import {
  BsArrowLeft, BsArchive, BsExclamationCircle, BsTrash, BsStar, BsStarFill, BsTag
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Compose from "../pages/Compose";
=======
import { Card, Spinner, Alert } from "react-bootstrap";
import {
  BsArrowLeft,
  BsArchive,
  BsExclamationCircle,
  BsTrash,
  BsStar,
  BsTag
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
>>>>>>> itay-yuval

function MailView({ emailId, onBack }) {
  const [mailData, setMailData] = useState(null);
  const [error, setError] = useState(null);
  const [showLabels, setShowLabels] = useState(false);
  const [labels, setLabels] = useState([]);
  const navigate = useNavigate();

<<<<<<< itay
  // Fetch the mail
=======
  // Fetch the mail data
>>>>>>> itay-yuval
  useEffect(() => {
    if (!emailId) return;
    setMailData(null);
    setError(null);
<<<<<<< itay

    fetch(`http://localhost:3000/api/mails/${emailId}`, {
      credentials: "include"
    })
      .then(res => res.ok ? res.json() : Promise.reject("Mail not found"))
      .then(mail => {
        setMailData(mail);
      })
      .catch(err => setError(err));
  }, [emailId]);

  // Fetch all labels
  useEffect(() => {
    fetch("http://localhost:3000/api/labels", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(setLabels)
      .catch(() => setLabels([]));
  }, []);

  const updateLabel = async (label, action = "add") => {
    try {
      const res = await fetch(`http://localhost:3000/api/mails/${emailId}/label`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ label, action })
      });

      if (!res.ok) throw new Error("Failed to update label");
      const updated = await res.json();
      setMailData(updated.mail);
    } catch (err) {
      alert("Label update failed: " + err.message);
    }
  };

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

  const handleLabel = () => setShowLabels(prev => !prev);
=======
    if (!emailId) return;

    (async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/mails/${emailId}`,
          { credentials: "include" }
        );
        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error || "Mail not found");
        }
        setMailData(await res.json());
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [emailId]);

  // Fetch available labels (system + custom) on mount
  useEffect(() => {
    fetch("http://localhost:3000/api/labels", { credentials: "include" })
      .then((res) => res.json())
      .then(setLabels)
      .catch(() => setLabels([]));
  }, []);

  // Toolbar action handlers
  const handleArchive = async () => {
    await updateLabel("archive");
    navigate("/archive");
  };

  const handleSpam = async () => {
    try {
      await fetch(
        `http://localhost:3000/api/mails/${emailId}/spam`,
        {
          method: "POST",
          credentials: "include"
        }
      );
      navigate("/spam");
    } catch (err) {
      alert("Failed to mark as spam: " + err.message);
    }
  };

  const handleDelete = async () => {
    await updateLabel("trash");
    navigate("/trash");
  };

  const handleStar = async () => {
    await updateLabel("starred");
    navigate("/starred");
  };

  const handleLabel = () => setShowLabels((s) => !s);
>>>>>>> itay-yuval

  const handleSelectLabel = async (label) => {
    await updateLabel(label);
    setShowLabels(false);
<<<<<<< itay
    navigate(`/label/${encodeURIComponent(label)}`);
  };

  const handleStar = async () => {
    const isStarred = mailData.labels?.includes("starred");
    await updateLabel("starred", isStarred ? "remove" : "add");
    navigate("/starred");
=======
    navigate(`/labels/${encodeURIComponent(label)}`);
  };

  // Helper to add a label to this mail
  const updateLabel = async (label) => {
    try {
      await fetch(
        `http://localhost:3000/api/mails/${emailId}/label`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ label })
        }
      );
    } catch (err) {
      alert("Failed to update label: " + err.message);
    }
>>>>>>> itay-yuval
  };

  if (error) {
    return (
      <Alert variant="danger" className="m-3">
        Error: {error}
      </Alert>
    );
  }

  if (!mailData) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <Spinner animation="border" />
      </div>
    );
  }

  if (mailData.labels?.includes("draft")) {
    return (
      <Compose
        draft={{
          id: mailData.id,
          to: mailData.recipientName || mailData.recipientId,
          subject: mailData.subject,
          content: mailData.content
        }}
        onClose={onBack}
      />
    );
  }

  return (
    <div className="p-3 mail-view-container" style={{ position: "relative" }}>
<<<<<<< itay
      <div className="mail-toolbar d-flex align-items-center gap-2 mb-3">
        <button className="gmail-icon-btn" onClick={onBack} title="Back">
          <BsArrowLeft size={18} />
        </button>
        <button className="gmail-icon-btn" onClick={handleArchive} title="Archive">
          <BsArchive size={18} />
        </button>
        <button className="gmail-icon-btn" onClick={handleLabel} title="Label">
          <BsTag size={18} />
        </button>
        <button className="gmail-icon-btn" onClick={handleStar} title="Star/Unstar">
          {mailData.labels?.includes("starred") ? (
            <BsStarFill className="text-warning" size={18} />
          ) : (
            <BsStar size={18} />
          )}
        </button>
        <button className="gmail-icon-btn" onClick={handleSpam} title="Report Spam">
          <BsExclamationCircle size={18} />
        </button>
        <button className="gmail-icon-btn" onClick={handleDelete} title="Delete">
=======
      {/* Gmail-style top toolbar */}
      <div className="mail-toolbar d-flex align-items-center gap-2 mb-3">
        <button
          className="gmail-icon-btn"
          onClick={onBack}
          title="Back to Inbox"
        >
          <BsArrowLeft size={18} />
        </button>
        <button
          className="gmail-icon-btn"
          onClick={handleArchive}
          title="Archive"
        >
          <BsArchive size={18} />
        </button>
        <button
          className="gmail-icon-btn"
          onClick={handleLabel}
          title="Label"
        >
          <BsTag size={18} />
        </button>
        <button
          className="gmail-icon-btn"
          onClick={handleStar}
          title="Star"
        >
          <BsStar size={18} />
        </button>
        <button
          className="gmail-icon-btn"
          onClick={handleSpam}
          title="Report spam"
        >
          <BsExclamationCircle size={18} />
        </button>
        <button
          className="gmail-icon-btn"
          onClick={handleDelete}
          title="Delete"
        >
>>>>>>> itay-yuval
          <BsTrash size={18} />
        </button>
      </div>

<<<<<<< itay
=======
      {/* Label Picker Dropdown */}
>>>>>>> itay-yuval
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
<<<<<<< itay
            labels.map(l => (
=======
            labels.map((l) => (
>>>>>>> itay-yuval
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

<<<<<<< itay
      <div className="card">
        <div className="card-header">
          <strong>From:</strong> {mailData.senderName || mailData.senderId}<br />
          <strong>To:</strong> {mailData.recipientName || mailData.recipientId}<br />
          <strong>Subject:</strong> {mailData.subject}<br />
        </div>
        <div className="card-body">
=======
      {/* Email Content */}
      <Card>
        <Card.Header>
          <strong>From:</strong> {mailData.senderName || mailData.senderId}
          <br />
          <strong>To:</strong> {mailData.recipientName || mailData.recipientId}
          <br />
          <strong>Subject:</strong> {mailData.subject}
          <br />
        </Card.Header>
        <Card.Body>
>>>>>>> itay-yuval
          <p>{mailData.content}</p>
        </div>
      </div>
    </div>
  );
}

export default MailView;

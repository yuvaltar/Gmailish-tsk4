import React, { useEffect, useMemo, useState } from "react";
import { Card, Spinner, Alert } from "react-bootstrap";
import {
  BsArrowLeft, BsArchive, BsExclamationCircle, BsTrash, BsStar, BsStarFill, BsTag,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Compose from "../pages/Compose";
import "./MailView.css";

function getInitials(name) {
  if (!name) return "•";
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "•";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

async function fetchUserById(id) {
  if (!id) return null;
  try {
    const res = await fetch(`/api/users/${encodeURIComponent(id)}`, { credentials: "include" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function MailView({ emailId, onBack }) {
  const [mailData, setMailData] = useState(null);
  const [error, setError] = useState(null);
  const [showLabels, setShowLabels] = useState(false);
  const [labels, setLabels] = useState([]);
  const [senderProfile, setSenderProfile] = useState(null);
  const [recipientProfile, setRecipientProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setMailData(null);
    setError(null);
    if (!emailId) return;
    (async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/mails/${emailId}`, { credentials: "include" });
        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error || "Mail not found");
        }
        const data = await res.json();
        setMailData(data);
        fetch(`http://localhost:3000/api/mails/${emailId}/read`, {
          method: "PATCH", credentials: "include",
        }).catch(() => {});
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [emailId]);

  useEffect(() => {
    fetch("http://localhost:3000/api/labels", { credentials: "include" })
      .then((r) => r.json()).then(setLabels).catch(() => setLabels([]));
  }, []);

  useEffect(() => {
    if (!mailData) { setSenderProfile(null); setRecipientProfile(null); return; }
    const senderId = mailData.senderId || mailData.sender || mailData.fromId;
    const recipientId = mailData.recipientId || mailData.recipient || mailData.toId;
    (async () => {
      const [s, r] = await Promise.all([fetchUserById(senderId), fetchUserById(recipientId)]);
      setSenderProfile(s); setRecipientProfile(r);
    })();
  }, [mailData]);

  const {
    senderDisplayName, senderEmail, senderAvatarUrl, recipientDisplayName, recipientEmail,
  } = useMemo(() => {
    const sFirst = senderProfile?.firstName?.trim();
    const sLast = senderProfile?.lastName?.trim();
    const sUsername = senderProfile?.username?.trim();
    const senderName = [sFirst, sLast].filter(Boolean).join(" ").trim()
      || mailData?.senderName || mailData?.senderUsername || mailData?.senderId || mailData?.sender || "";
    const senderMail = sUsername ? `${sUsername}@gmailish.com` : (mailData?.senderEmail || "");
    const sId = senderProfile?.id || mailData?.senderId || mailData?.sender || "";
    const sPic = sId ? `/api/users/${encodeURIComponent(sId)}/picture` : null;

    const rFirst = recipientProfile?.firstName?.trim();
    const rLast = recipientProfile?.lastName?.trim();
    const rUsername = recipientProfile?.username?.trim();
    const recipientName = [rFirst, rLast].filter(Boolean).join(" ").trim()
      || mailData?.recipientName || mailData?.recipientUsername || mailData?.recipientId || mailData?.recipient || "";
    const recipientMail = rUsername ? `${rUsername}@gmailish.com` : (mailData?.recipientEmail || "");

    return {
      senderDisplayName: senderName || sUsername || "Unknown",
      senderEmail: senderMail || (sUsername ? `${sUsername}@gmailish.com` : ""),
      senderAvatarUrl: sPic,
      recipientDisplayName: recipientName || rUsername || "Unknown",
      recipientEmail: recipientMail || (rUsername ? `${rUsername}@gmailish.com` : ""),
    };
  }, [senderProfile, recipientProfile, mailData]);

  const updateLabel = async (label) => {
    try {
      const method = mailData.labels.includes(label) ? "DELETE" : "PATCH";
      const url = method === "PATCH"
        ? `http://localhost:3000/api/mails/${emailId}/label`
        : `http://localhost:3000/api/mails/${emailId}/label/${label}`;
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" }, credentials: "include",
        body: method === "PATCH" ? JSON.stringify({ label }) : null,
      });
      if (!res.ok) throw new Error("Label toggle failed");
      const updated = await res.json();
      setMailData(updated.mail);
    } catch (err) {
      alert("Failed to toggle label: " + err.message);
    }
  };

  const handleArchive = async () => {
    try {
      const isArchived = mailData.labels.includes("archive");
      if (isArchived) {
        await fetch(`http://localhost:3000/api/mails/${emailId}/label/archive`, { method: "DELETE", credentials: "include" });
        await fetch(`http://localhost:3000/api/mails/${emailId}/label`, {
          method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "include",
          body: JSON.stringify({ label: "inbox" }),
        });
      } else {
        await fetch(`http://localhost:3000/api/mails/${emailId}/label`, {
          method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "include",
          body: JSON.stringify({ label: "archive" }),
        });
        await fetch(`http://localhost:3000/api/mails/${emailId}/label/inbox`, { method: "DELETE", credentials: "include" });
      }
      const res = await fetch(`http://localhost:3000/api/mails/${emailId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to reload mail");
      const updated = await res.json();
      setMailData(updated);
    } catch (err) {
      alert("Failed to toggle archive: " + err.message);
    }
  };

  const handleSpam = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/mails/${emailId}/spam`, { method: "POST", credentials: "include" });
      if (!res.ok) throw new Error("Spam toggle failed");
      const updated = await res.json();
      setMailData(updated.mail);
    } catch (err) {
      alert("Failed to toggle spam: " + err.message);
    }
  };

  const handleDelete = async () => {
    try {
      const isTrashed = mailData.labels.includes("trash");
      if (isTrashed) {
        await fetch(`http://localhost:3000/api/mails/${emailId}/label/trash`, { method: "DELETE", credentials: "include" });
        await fetch(`http://localhost:3000/api/mails/${emailId}/label`, {
          method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "include",
          body: JSON.stringify({ label: "inbox" }),
        });
      } else {
        await fetch(`http://localhost:3000/api/mails/${emailId}/label`, {
          method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "include",
          body: JSON.stringify({ label: "trash" }),
        });
        await fetch(`http://localhost:3000/api/mails/${emailId}/label/inbox`, { method: "DELETE", credentials: "include" });
      }
      const res = await fetch(`http://localhost:3000/api/mails/${emailId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to reload mail");
      const updated = await res.json();
      setMailData(updated);
    } catch (err) {
      alert("Failed to toggle trash: " + err.message);
    }
  };

  const handleToggleStar = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/mails/${emailId}/star`, { method: "PATCH", credentials: "include" });
      if (!res.ok) throw new Error("Star toggle failed");
      const { starred } = await res.json();
      setMailData((prev) => ({ ...prev, starred }));
    } catch (err) {
      alert("Failed to toggle star: " + err.message);
    }
  };

  const handleLabel = () => setShowLabels((s) => !s);
  const handleSelectLabel = async (label) => {
    await updateLabel(label);
    setShowLabels(false);
    navigate(`/${encodeURIComponent(label)}`);
  };

  if (error) return <Alert variant="danger" className="m-3">Error: {error}</Alert>;
  if (!mailData) {
    return <div className="d-flex justify-content-center align-items-center h-100">
      <Spinner animation="border" />
    </div>;
  }
  if (mailData.labels.includes("drafts")) {
    return (
      <div className="main-content is-mail-view">
        {/* keep the same inner container so layout/background persist */}
        <div className="mail-view-inner email-page-inner p-3" style={{ position: "relative" }}>
          <Compose
            draft={{
              id: mailData.id,
              to: mailData.recipientEmail || mailData.recipientId,
              subject: mailData.subject,
              content: mailData.content,
            }}
            onClose={onBack}
          />
        </div>
      </div>
    );
  }


  return (
    <div className="main-content is-mail-view">
      <div className="mail-view-inner p-3" style={{ position: "relative" }}>
        <div className="mail-toolbar d-flex align-items-center gap-2 mb-3">
          <button className="gmail-icon-btn" onClick={onBack} title="Back to Inbox"><BsArrowLeft size={18} /></button>
          <button className="gmail-icon-btn" onClick={handleArchive} title="Archive">
            <BsArchive size={18} className={mailData.labels.includes("archive") ? "text-primary" : ""} />
          </button>
          <button className="gmail-icon-btn" onClick={handleLabel} title="Label">
            <BsTag size={18} className={showLabels ? "text-primary" : ""} />
          </button>
          <button className="gmail-icon-btn" onClick={handleToggleStar} title="Star">
            {mailData.starred ? <BsStarFill className="text-warning" size={18} /> : <BsStar size={18} />}
          </button>
          <button className="gmail-icon-btn" onClick={handleSpam} title="Report spam">
            <BsExclamationCircle size={18} className={mailData.labels.includes("spam") ? "text-danger" : ""} />
          </button>
          <button className="gmail-icon-btn" onClick={handleDelete} title="Move to trash / Untrash">
            <BsTrash size={18} className={mailData.labels.includes("trash") ? "text-danger" : ""} />
          </button>
        </div>

        {showLabels && (
          <div className="label-menu" style={{ position: "absolute", top: 50, left: 120, zIndex: 10, boxShadow: "none" }}>
            {labels.length === 0 ? (
              <div className="label-menu-empty">No labels</div>
            ) : (
              labels.map((l) => {
                const isActive = mailData.labels.includes(l.name);
                return (
                  <div
                    key={l.name}
                    className={`label-picker-item ${isActive ? "selected-label" : ""}`}
                    aria-selected={isActive}
                    onClick={() => handleSelectLabel(l.name)}
                  >
                    {l.name}
                  </div>
                );
              })
            )}
          </div>
        )}

        <Card className="mail-view-card">
          <div className="sender-row">
            <div className="sender-avatar" aria-hidden="true">
              {senderAvatarUrl ? <img src={senderAvatarUrl} alt="" /> : <span className="initials">{getInitials(senderDisplayName)}</span>}
            </div>

            <div className="sender-meta">
              <div className="sender-line">
                <strong>From:&nbsp;</strong>
                <span className="sender-name">{senderDisplayName || "Unknown sender"}</span>
                {senderEmail && <span className="sender-email">&nbsp;&lt;{senderEmail}&gt;</span>}
              </div>
              <div className="to-line">
                <strong>To:&nbsp;</strong>
                <span className="recipient-name">{recipientDisplayName || "Unknown recipient"}</span>
                {recipientEmail && <span className="muted">&nbsp;&lt;{recipientEmail}&gt;</span>}
              </div>
              {mailData.subject
                ? <div className="subject-line-strong">{mailData.subject}</div>
                : <div className="subject-line-strong muted">(No subject)</div>}
            </div>

            <button className="gmail-icon-btn ms-auto" onClick={handleToggleStar} title="Toggle star">
              {mailData.starred ? <BsStarFill className="text-warning" size={18} /> : <BsStar size={18} />}
            </button>
          </div>

          <div className="divider" />
          <Card.Body><p>{mailData.content}</p></Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default MailView;

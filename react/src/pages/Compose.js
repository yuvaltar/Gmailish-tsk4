import React, { useState } from "react";
import { X, ArrowsFullscreen } from "react-bootstrap-icons";

function Compose({ onClose }) {
  const [minimized, setMinimized] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");


  const handleClose = async () => {
  if (subject.trim() || body.trim()) {
    try {
      await fetch("/api/mails/drafts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ to, subject, content: body })
      });
      console.log("Draft saved.");
    } catch (err) {
      console.error("Failed to save draft:", err.message);
    }
  }
  if (onClose) onClose();
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // STEP 1: Fetch user ID by email
      const userRes = await fetch(`http://localhost:3000/api/users/by-email/${encodeURIComponent(to)}`, {
        credentials: "include"
      });

      if (!userRes.ok) throw new Error("Recipient not found");
      const { id: recipientId } = await userRes.json();

      // STEP 2: Send the mail with recipient ID
      const mailRes = await fetch("http://localhost:3000/api/mails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ to: recipientId, subject, content: body })
      });

      if (!mailRes.ok) {
        const errMsg = await mailRes.json();
        throw new Error(errMsg.error || "Failed to send mail");
      }

      alert("Mail sent!");
      setTo(""); setSubject(""); setBody("");
      if (onClose) onClose();

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className={
      `compose-popup ` +
      (!expanded && !minimized ? "compose-box " : "") +
      (expanded && !minimized ? "compose-expanded " : "") +
      (minimized ? "minimized" : "")
    }>
      <div className="compose-header d-flex justify-content-between align-items-center px-3 py-2">
        <strong>New Message</strong>
        <div>
          <button
            className="btn btn-sm btn-light me-2"
            onClick={() => setMinimized(!minimized)}
            title="Minimize"
          >
            _
          </button>
          <button
            className="btn btn-sm btn-light me-2"
            onClick={() => {
              if (minimized) {
                setMinimized(false);
                setExpanded(false);
              } else {
                setExpanded(!expanded);
              }
            }}
            title="Expand"
          >
            <ArrowsFullscreen size={14} />
          </button>
          <button className="btn btn-sm btn-light" onClick={handleClose} title="Close">
            <X size={14} />
          </button>
        </div>
      </div>

      {!minimized && (
        <form className="p-3 pt-0" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Recipients (email)"
            className="form-control mb-2"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          <input
            type="text"
            placeholder="Subject"
            className="form-control mb-2"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <textarea
            className="form-control mb-2"
            placeholder="Body"
            rows="6"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <button type="submit" className="btn btn-sm btn-primary">Send</button>
        </form>
      )}
    </div>
  );
}

export default Compose;

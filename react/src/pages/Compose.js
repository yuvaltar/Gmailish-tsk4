import React, { useState } from "react";

import { X, ArrowsFullscreen } from "react-bootstrap-icons"; 

function Compose({ onClose }) {
  const [minimized, setMinimized] = useState(false);
  const [expanded, setExpanded] = useState(false);


  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3000/api/mails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ to, subject, body })
      });

      if (!res.ok) throw new Error("Failed to send mail");
      alert("Mail sent!");
      setTo(""); setSubject(""); setBody("");

      if (onClose) onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  return (

    <div
    className={
        `compose-popup ` +
        (!expanded && !minimized ? "compose-box " : "") +
        (expanded && !minimized ? "compose-expanded " : "") +
        (minimized ? "minimized" : "")
    }
    >
      {/* Header */}
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
                setMinimized(false); // Restore to medium size
                setExpanded(false);  // Ensure not full screen
                } else {
                setExpanded(!expanded); // Toggle full screen
                }
            }}
            title="Expand"
            >
            <ArrowsFullscreen size={14} />
            </button>

          <button className="btn btn-sm btn-light" onClick={onClose} title="Close">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Body (hidden if minimized) */}
      {!minimized && (
        <form className="p-3 pt-0" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Recipients"
            className="form-control mb-2"

            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Subject"
            className="form-control mb-2"

            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />

          <textarea
            className="form-control mb-2"
            placeholder="Body"
            rows="6"

            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />

          <button type="submit" className="btn btn-sm btn-primary">Send</button>
        </form>
      )}

    </div>
  );
}

export default Compose;

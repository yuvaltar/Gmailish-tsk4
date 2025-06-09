import React, { useState } from "react";

function Compose({ onClose }) {
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

      // Close the floating box if there's an onClose handler
      if (onClose) onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      {/* Close button */}
      {onClose && (
        <button
          className="btn-close float-end"
          onClick={onClose}
          aria-label="Close"
        ></button>
      )}

      <h5 className="mb-3">New Message</h5>

      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <input
            type="email"
            placeholder="To"
            className="form-control"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
          />
        </div>
        <div className="mb-2">
          <input
            type="text"
            placeholder="Subject"
            className="form-control"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div className="mb-2">
          <textarea
            className="form-control"
            placeholder="Body"
            rows="5"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-sm btn-primary mt-2">
          Send
        </button>
      </form>
    </div>
  );
}

export default Compose;

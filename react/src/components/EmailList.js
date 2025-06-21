// src/components/EmailList.js
import React, { useState, useEffect } from "react";
import { Table, Form } from "react-bootstrap";
import {
  BsArrowClockwise,
  BsEnvelopeOpen,
  BsEnvelope,
  BsStar,
  BsStarFill,
  BsTag,
  BsExclamationCircle,
  BsTrash,
  BsArchive,
} from "react-icons/bs";
import PropTypes from "prop-types";
import "./EmailList.css";

function EmailList({ setSelectedEmail, propEmails, labelFilter, searchQuery }) {
  const [emails, setEmails] = useState([]);
  const [checkedEmails, setCheckedEmails] = useState(new Set());
  const [showLabelPicker, setShowLabelPicker] = useState(false);
  const [labels, setLabels] = useState([]);

  const fetchEmails = async () => {
    let url = "http://localhost:3000/api/mails";
    if (labelFilter) {
      url += `?label=${encodeURIComponent(labelFilter)}`;
    }

    try {
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid data");
      setEmails(data);
      setCheckedEmails(new Set());
    } catch (err) {
      console.error("Failed to fetch mails:", err.message);
      setEmails([]);
    }
  };

  useEffect(() => {
    if (propEmails) {
      setEmails(propEmails);
      return;
    }
    fetchEmails();
  }, [propEmails, labelFilter]);

  useEffect(() => {
    if (!searchQuery) {
      if (!propEmails) fetchEmails();
      return;
    }

    setEmails((prev) =>
      prev.filter(
        (m) =>
          m.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.content?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery]);

  useEffect(() => {
    fetch("http://localhost:3000/api/labels", { credentials: "include" })
      .then((res) => res.json())
      .then(setLabels)
      .catch(() => setLabels([]));
  }, []);

  const handleCheckboxChange = (emailId) => {
    const newChecked = new Set(checkedEmails);
    if (newChecked.has(emailId)) newChecked.delete(emailId);
    else newChecked.add(emailId);
    setCheckedEmails(newChecked);
  };

  const handleSelectAll = (e) => {
    setCheckedEmails(e.target.checked ? new Set(emails.map((e) => e.id)) : new Set());
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch("http://localhost:3000/api/mails/markAllRead", {
        method: "PATCH",
        credentials: "include",
      });
      fetchEmails();
    } catch (err) {
      console.error("Mark all as read failed", err.message);
    }
  };

  const handleMarkSelectedAsUnread = async () => {
    if (checkedEmails.size === 0) return;
    try {
      await fetch("http://localhost:3000/api/mails/markUnread", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ids: Array.from(checkedEmails) }),
      });
      fetchEmails();
    } catch (err) {
      console.error("Mark as unread failed", err.message);
    }
  };

  const handleStarSelected = async () => {
    for (const id of checkedEmails) {
      await fetch(`/api/mails/${id}/star`, {
        method: "PATCH",
        credentials: "include",
      });
    }
    fetchEmails();
  };

  const handleSpamSelected = async () => {
    for (const id of checkedEmails) {
      await fetch(`/api/mails/${id}/spam`, {
        method: "POST",
        credentials: "include",
      });
    }
    fetchEmails();
  };

  const handleToggleTrashSelected = async () => {
    for (const id of checkedEmails) {
      const email = emails.find(e => e.id === id);
      if (!email) continue;

      if (email.labels.includes("trash")) {
        await fetch(`/api/mails/${id}/label/trash`, {
          method: "DELETE",
          credentials: "include",
        });
        await fetch(`/api/mails/${id}/label`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ label: "inbox" }),
        });
      } else {
        await fetch(`/api/mails/${id}/label`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ label: "trash" }),
        });
        await fetch(`/api/mails/${id}/label/inbox`, {
          method: "DELETE",
          credentials: "include",
        });
      }
    }
    fetchEmails();
  };

  const handleToggleArchiveSelected = async () => {
    for (const id of checkedEmails) {
      const email = emails.find((e) => e.id === id);
      if (!email) continue;

      if (email.labels.includes("archive")) {
        // UNARCHIVE: remove archive label only
        await fetch(`/api/mails/${id}/label/archive`, {
          method: "DELETE",
          credentials: "include",
        });
      } else {
        // ARCHIVE: add archive (leave inbox)
        await fetch(`/api/mails/${id}/label`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ label: "archive" }),
        });
      }
    }
    fetchEmails();
  };


  const handleLabelSelected = async (label) => {
    for (const id of checkedEmails) {
      await fetch(`/api/mails/${id}/label`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ label }),
      });
    }
    setShowLabelPicker(false);
    fetchEmails();
  };

  const toggleStar = async (emailId) => {
    try {
      const res = await fetch(`/api/mails/${emailId}/star`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Star toggle failed");
      const { starred } = await res.json();
      setEmails((prev) =>
        prev.map((email) =>
          email.id === emailId ? { ...email, starred } : email
        )
      );
    } catch (err) {
      console.error("Failed to toggle star:", err.message);
    }
  };

  const isAllSelected = emails.length > 0 && checkedEmails.size === emails.length;
  const hasSelection = checkedEmails.size > 0;

  return (
    <div className="w-100 p-0 position-relative">
      <div className="email-toolbar d-flex align-items-center ps-1 py-0.1 border-bottom">
        <div className="toolbar-group d-flex align-items-center gap-2 px-2 py-1">
          <Form.Check type="checkbox" checked={isAllSelected} onChange={handleSelectAll} />

          {!hasSelection ? (
            <>
              <button className="gmail-icon-btn" onClick={fetchEmails} title="Refresh">
                <BsArrowClockwise size={18} />
              </button>
              <button className="gmail-icon-btn" onClick={handleMarkAllAsRead} title="Mark all as read">
                <BsEnvelopeOpen size={18} />
              </button>
            </>
          ) : (
            <>
              <button className="gmail-icon-btn" onClick={handleMarkAllAsRead} title="Mark as read">
                <BsEnvelopeOpen size={18} />
              </button>
              <button className="gmail-icon-btn" onClick={handleMarkSelectedAsUnread} title="Mark as unread">
                <BsEnvelope size={18} />
              </button>
              <button className="gmail-icon-btn" onClick={handleStarSelected} title="Star">
                <BsStar size={18} />
              </button>
              <button className="gmail-icon-btn" onClick={handleToggleArchiveSelected} title="Archive / Unarchive">
                <BsArchive size={18} />
              </button>
              <button className="gmail-icon-btn" onClick={() => setShowLabelPicker((s) => !s)} title="Label">
                <BsTag size={18} />
              </button>
              <button className="gmail-icon-btn" onClick={handleSpamSelected} title="Spam">
                <BsExclamationCircle size={18} />
              </button>
              <button className="gmail-icon-btn" onClick={handleToggleTrashSelected} title="Trash / Untrash">
                <BsTrash size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      {showLabelPicker && (
        <div
          style={{
            position: "absolute",
            top: 45,
            left: 150,
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 4,
            zIndex: 10,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          {labels.length === 0 ? (
            <div style={{ padding: "1rem" }}>No labels</div>
          ) : (
            labels.map((l) => (
              <div
                key={l.name}
                onClick={() => handleLabelSelected(l.name)}
                style={{
                  cursor: "pointer",
                  padding: "0.5rem 1rem",
                  borderBottom: "1px solid #eee",
                }}
              >
                {l.name}
              </div>
            ))
          )}
        </div>
      )}

      <Table hover className="mb-0">
        <tbody>
          {emails.map((email) => (
            <tr key={email.id} onClick={() => setSelectedEmail(email.id)} style={{ cursor: "pointer" }}>
              <td colSpan={3} className="p-0">
                <div
                  className={`email-row-flex d-flex align-items-center justify-content-between w-100 ${
                    checkedEmails.has(email.id) ? "table-primary" : ""
                  } ${email.read ? "read-mail" : "unread-mail"}`}
                >
                  <div className="d-flex align-items-center gap-2 ps-3">
                    <Form.Check
                      type="checkbox"
                      checked={checkedEmails.has(email.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleCheckboxChange(email.id);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(email.id);
                      }}
                      className="star-cell"
                    >
                      {email.starred ? (
                        <BsStarFill className="star-filled" size={14} />
                      ) : (
                        <BsStar className="star-empty" size={14} />
                      )}
                    </span>
                  </div>

                  <div className="email-snippet-cell flex-grow-1 px-3">
                    <div className="sender-name" title={email.senderName || email.senderId}>
                      {email.senderName || email.senderId}
                    </div>
                    <div className="subject-line" title={email.subject}>
                      {email.subject.length > 80 ? email.subject.slice(0, 77) + "..." : email.subject}
                    </div>
                  </div>

                  <div className="email-date pe-3 text-nowrap">
                    {new Date(email.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

EmailList.propTypes = {
  setSelectedEmail: PropTypes.func.isRequired,
  propEmails: PropTypes.array,
  labelFilter: PropTypes.string,
  searchQuery: PropTypes.string,
};

EmailList.defaultProps = {
  propEmails: null,
  labelFilter: "inbox",
  searchQuery: "",
};

export default EmailList;

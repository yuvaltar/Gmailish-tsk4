// src/components/EmailList.js
import React, { useState, useEffect } from "react";
import { Table, Form } from "react-bootstrap";
import {
  BsArrowClockwise,
  BsEnvelopeOpen,
} from "react-icons/bs";
import PropTypes from "prop-types";
import { getUserIdFromToken } from "../utils/auth";
import "./EmailList.css";

export default function EmailList({ setSelectedEmail, propEmails, labelFilter }) {
  const [emails, setEmails] = useState([]);
  const [checkedEmails, setCheckedEmails] = useState(new Set());

  const fetchEmails = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/mails", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch mails");
      const data = await res.json();

      const userId = getUserIdFromToken();
      console.log("User ID:", userId);
      console.log("Fetched mails:", data);

      // Final filtering logic
      const filtered = data.filter((email) =>
        email.labels?.includes(labelFilter || "inbox") &&
        (
          (labelFilter === "sent" && email.senderId === userId) ||
          (labelFilter !== "sent" && email.recipientId === userId)
        )
      );

      setEmails(filtered);
      setCheckedEmails(new Set());
    } catch (err) {
      console.error("Fetch error:", err);
      setEmails([]);
    }
  };

  useEffect(() => {
    if (propEmails) {
      setEmails(propEmails);
      setCheckedEmails(new Set());
    } else {
      fetchEmails();
    }
  }, [propEmails, labelFilter]);

  const handleCheckboxChange = (emailId) => {
    const newChecked = new Set(checkedEmails);
    if (newChecked.has(emailId)) newChecked.delete(emailId);
    else newChecked.add(emailId);
    setCheckedEmails(newChecked);
  };

  const handleSelectAll = (e) => {
    setCheckedEmails(
      e.target.checked ? new Set(emails.map((e) => e.id)) : new Set()
    );
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch("http://localhost:3000/api/mails/markAllRead", {
        method: "PATCH",
        credentials: "include",
      });
      fetchEmails();
    } catch (err) {
      console.error("Mark all read failed:", err);
    }
  };

  const isAllSelected =
    checkedEmails.size > 0 && checkedEmails.size === emails.length;

  return (
    <div className="w-100 p-0">
      <div className="email-toolbar d-flex align-items-center ps-1 py-0.1 border-bottom">
        <div className="toolbar-group d-flex align-items-center gap-2 px-2 py-1">
          <Form.Check
            type="checkbox"
            checked={isAllSelected}
            onChange={handleSelectAll}
          />
          <button
            className="gmail-icon-btn"
            onClick={fetchEmails}
            title="Refresh"
          >
            <BsArrowClockwise size={18} />
          </button>
          <button
            className="gmail-icon-btn"
            onClick={handleMarkAllAsRead}
            title="Mark all as read"
          >
            <BsEnvelopeOpen size={18} />
          </button>
        </div>
      </div>

      <Table hover className="mb-0">
        <tbody>
          {emails.map((email) => (
            <tr
              key={email.id}
              onClick={() => setSelectedEmail(email.id)}
              className={checkedEmails.has(email.id) ? "table-primary" : ""}
              style={{ cursor: "pointer" }}
            >
              <td className="ps-3">
                <Form.Check
                  type="checkbox"
                  checked={checkedEmails.has(email.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleCheckboxChange(email.id);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              </td>
              <td className="email-snippet-cell">
                <div
                  className="sender-name"
                  title={email.senderName || email.senderId}
                >
                  {email.senderName || email.senderId}
                </div>
                <div className="subject-line" title={email.subject}>
                  {email.subject.length > 80
                    ? email.subject.slice(0, 77) + "..."
                    : email.subject}
                </div>
              </td>
              <td className="text-end pe-3">
                {new Date(email.timestamp).toLocaleDateString()}
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
};

EmailList.defaultProps = {
  propEmails: null,
  labelFilter: "inbox",
};

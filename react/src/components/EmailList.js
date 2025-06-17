import React, { useState, useEffect } from "react";
import { Table, Form } from "react-bootstrap";
import { BsArrowClockwise, BsEnvelopeOpen, BsStar, BsStarFill } from "react-icons/bs";
import PropTypes from "prop-types";
import "./EmailList.css";

/**
 * EmailList component displays a list of emails, optionally filtered by label.
 *
 * Props:
 * - setSelectedEmail(emailId): callback for when a row is clicked
 * - propEmails: array of emails from a search result (optional)
 * - labelFilter: string matching the current label (e.g. "inbox", "starred", "spam")
 */
function EmailList({ setSelectedEmail, propEmails, labelFilter }) {
  const [emails, setEmails] = useState([]);
  const [checkedEmails, setCheckedEmails] = useState(new Set());

  // Build fetch URL based on optional labelFilter
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
      // Reset any checks when folder changes
      setCheckedEmails(new Set());
    } catch (err) {
      console.error("Failed to fetch mails:", err.message);
      setEmails([]);
    }
  };

  // Whenever either propEmails (search results) OR labelFilter changes, reload
  useEffect(() => {
    if (propEmails) {
      setEmails(propEmails);
      return;
    }
    fetchEmails();
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
      console.error("Mark all as read failed", err.message);
    }
  };

  const toggleStar = (emailId) => {
    setEmails((prev) =>
      prev.map((email) =>
        email.id === emailId ? { ...email, starred: !email.starred } : email
      )
    );
  };

  const isAllSelected =
    emails.length > 0 && checkedEmails.size === emails.length;

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
              className={
                checkedEmails.has(email.id) ? "table-primary" : ""
              }
              style={{ cursor: "pointer" }}
            >
              <td className="ps-3">
                <div className="email-checkbox-star d-flex align-items-center gap-2">
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

export default EmailList;

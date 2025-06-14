import React, { useState, useEffect } from "react";
import { Table, Form, Button } from "react-bootstrap";
import { BsArrowClockwise, BsEnvelopeOpen, BsStar, BsStarFill } from "react-icons/bs";
import "./EmailList.css";

function EmailList({ setSelectedEmail, emails: propEmails }) {
  const [emails, setEmails] = useState([]);
  const [checkedEmails, setCheckedEmails] = useState(new Set());

  const fetchEmails = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/mails", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid data");
      setEmails(data);
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
  }, [propEmails]);

  const handleDelete = async (emailId) => {
    if (!window.confirm("Are you sure you want to delete this email?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/mails/${emailId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.status === 204) {
        setEmails(emails.filter((email) => email.id !== emailId));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete email.");
      }
    } catch (err) {
      alert("Failed to delete email: " + err.message);
    }
  };

  const handleCheckboxChange = (emailId) => {
    const newChecked = new Set(checkedEmails);
    newChecked.has(emailId) ? newChecked.delete(emailId) : newChecked.add(emailId);
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

  const toggleStar = (emailId) => {
    setEmails((prev) =>
      prev.map((email) =>
        email.id === emailId ? { ...email, starred: !email.starred } : email
      )
    );
  };

  const isAllSelected = checkedEmails.size > 0 && checkedEmails.size === emails.length;

  return (
    <div className="w-100 p-0">
      <div className="email-toolbar d-flex align-items-center ps-1 py-0.1 border-bottom">
        <div className="toolbar-group d-flex align-items-center gap-2 px-2 py-1">
          <Form.Check
            type="checkbox"
            checked={isAllSelected}
            onChange={handleSelectAll}
          />
          <button className="gmail-icon-btn" onClick={fetchEmails} title="Refresh inbox">
            <BsArrowClockwise size={18} />
          </button>
          <button className="gmail-icon-btn" onClick={handleMarkAllAsRead} title="Mark all as read">
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
              <td className="ps-3" onClick={(e) => e.stopPropagation()}>
                <div className="email-checkbox-star d-flex align-items-center gap-2">
                  <Form.Check
                    type="checkbox"
                    checked={checkedEmails.has(email.id)}
                    onChange={() => handleCheckboxChange(email.id)}
                  />
                  <span onClick={() => toggleStar(email.id)} className="star-cell">
                    {email.starred ? (
                      <BsStarFill className="star-filled" size={14} />
                    ) : (
                      <BsStar className="star-empty" size={14} />
                    )}
                  </span>
                </div>
              </td>

              <td className="email-snippet-cell">
                <div className="sender-name" title={email.senderName || email.senderId}>
                  {email.senderName || email.senderId}
                </div>
                <div className="subject-line" title={email.subject}>
                  {email.subject.length > 80 ? email.subject.slice(0, 77) + "..." : email.subject}
                </div>
              </td>

              <td className="text-end pe-3">
                {new Date(email.timestamp).toLocaleDateString()}
              </td>

              <td onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(email.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default EmailList;

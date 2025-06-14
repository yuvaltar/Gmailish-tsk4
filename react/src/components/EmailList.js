import React, { useState, useEffect } from "react";
import { Table, Form, Button } from "react-bootstrap";
import { BsArrowClockwise, BsEnvelopeOpen } from "react-icons/bs";

import './EmailList.css';

function EmailList({ setSelectedEmail, emails: propEmails }) {
  const [emails, setEmails] = useState([]);
  const [checkedEmails, setCheckedEmails] = useState(new Set());

  const fetchEmails = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/mails", {
        credentials: "include"
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
    const fetchEmails = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/mails", {
          credentials: "include"
        });
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Invalid data type");
        setEmails(data);
      } catch (err) {
        console.error("Failed to fetch mails:", err.message);
        setEmails([]);
      }
    };
    fetchEmails();
  }, [propEmails]);

  // Delete handler
  const handleDelete = async (emailId) => {
    if (!window.confirm("Are you sure you want to delete this email?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/mails/${emailId}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (res.status === 204) {
        setEmails(emails.filter(email => email.id !== emailId));
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
  if (e.target.checked) {
    setCheckedEmails(new Set(emails.map(e => e.id)));
  } else {
    setCheckedEmails(new Set());
  }
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

  const isAllSelected = checkedEmails.size > 0 && checkedEmails.size === emails.length;

  return (
    <div className="w-100 p-0">
      {/* Gmail-style toolbar */}
      <div className="email-toolbar d-flex align-items-center gap-2 ps-1 py-0.1 border-bottom">
  <div style={{ padding: '1rem' }}>
  <input
  type="checkbox"
  checked={isAllSelected}
  onChange={handleSelectAll}
/>

</div>

  <button className="gmail-icon-btn" onClick={fetchEmails} title="Refresh inbox">
    <BsArrowClockwise size={18} />
  </button>
  <button className="gmail-icon-btn" onClick={handleMarkAllAsRead} title="Mark all as read">
    <BsEnvelopeOpen size={18} />
  </button>
</div>


      {/* Inbox table */}
      <Table hover className="mb-0">
        
        <tbody>
          {emails.map((email) => (
            <tr
              key={email.id}
              onClick={() => setSelectedEmail(email.id)}
              style={{ cursor: "pointer" }}
              className={checkedEmails.has(email.id) ? 'table-primary' : ''}
            >
              <td className="ps-3" onClick={e => e.stopPropagation()}>
                <Form.Check 
                  type="checkbox"
                  checked={checkedEmails.has(email.id)}
                  onChange={() => handleCheckboxChange(email.id)}
                />
              </td>
              <td className="email-sender">{email.senderName || email.senderId}</td>
              <td className="email-subject">{email.subject}</td>
              <td className="text-end pe-3">
                {new Date(email.timestamp).toLocaleDateString()}
              </td>
              <td onClick={e => e.stopPropagation()}>
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

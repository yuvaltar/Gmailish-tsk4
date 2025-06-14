import React, { useState, useEffect } from "react";
import { Table, Form, Button } from "react-bootstrap";
import './EmailList.css';

function EmailList({ setSelectedEmail, emails: propEmails }) {
  const [emails, setEmails] = useState([]);
  const [checkedEmails, setCheckedEmails] = useState(new Set());

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
    setCheckedEmails(e.target.checked ? new Set(emails.map(e => e.id)) : new Set());
  };

  const isAllSelected = checkedEmails.size > 0 && checkedEmails.size === emails.length;

  return (
    <div className="w-100 p-0">
      <Table hover className="mb-0">
        <thead>
          <tr>
            <th className="ps-3" style={{ width: '50px' }}>
              <Form.Check 
                type="checkbox"
                checked={isAllSelected}
                onChange={handleSelectAll}
              />
            </th>
            <th colSpan="3">Primary</th>
            <th style={{ width: "80px" }}>Actions</th>
          </tr>
        </thead>
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

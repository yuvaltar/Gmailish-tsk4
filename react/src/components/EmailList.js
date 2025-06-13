import React, { useState, useEffect } from "react";
import { Table, Form } from "react-bootstrap";
import './EmailList.css';

function EmailList({ setSelectedEmail }) {
  const [emails, setEmails] = useState([]);
  const [checkedEmails, setCheckedEmails] = useState(new Set());

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/mails", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // ✅ If request fails (e.g. 401), throw
        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();

        // ✅ Ensure we only set emails if the data is an array
        if (!Array.isArray(data)) throw new Error("Invalid data type");

        setEmails(data);
      } catch (err) {
        console.error("Failed to fetch mails:", err.message);
        setEmails([]); // 🛡️ fallback to empty to avoid .map crash
      }
    };
    fetchEmails();
  }, []);

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
              <td className="ps-3" onClick={(e) => e.stopPropagation()}>
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
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default EmailList;

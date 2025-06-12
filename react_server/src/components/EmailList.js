import React, { useState } from "react";
import { Table, Form } from "react-bootstrap";
import './EmailList.css';

function EmailList({ setSelectedEmail }) {
  const [emails, setEmails] = useState([
    {
      id: '1',
      senderId: 'Google Photos',
      subject: 'A new highlight video for you',
      timestamp: new Date(2025, 5, 10, 10, 44, 0).toISOString(),
    },
    {
      id: '2',
      senderId: 'GitHub',
      subject: '[GitHub] A personal access token was added to your account',
      timestamp: new Date(2025, 5, 9, 11, 20, 0).toISOString(),
    },
    {
      id: '3',
      senderId: 'Figma',
      subject: 'Your weekly team updates and new files',
      timestamp: new Date(2025, 5, 8, 16, 5, 0).toISOString(),
    },
  ]);
  
  // New state to keep track of checked email IDs
  const [checkedEmails, setCheckedEmails] = useState(new Set());

  // Handles clicking a single checkbox
  const handleCheckboxChange = (emailId) => {
    const newCheckedEmails = new Set(checkedEmails);
    if (newCheckedEmails.has(emailId)) {
      newCheckedEmails.delete(emailId);
    } else {
      newCheckedEmails.add(emailId);
    }
    setCheckedEmails(newCheckedEmails);
  };

  // Handles clicking the "select all" checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // Select all
      const allEmailIds = new Set(emails.map(email => email.id));
      setCheckedEmails(allEmailIds);
    } else {
      // Deselect all
      setCheckedEmails(new Set());
    }
  };
  
  const isAllSelected = checkedEmails.size > 0 && checkedEmails.size === emails.length;

  return (
    <div className="w-100 p-0">
      <Table hover>
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
              <td 
                className="ps-3" 
                onClick={(e) => e.stopPropagation()} // Prevent row click when clicking checkbox area
              >
                  <Form.Check 
                      type="checkbox"
                      checked={checkedEmails.has(email.id)}
                      onChange={() => handleCheckboxChange(email.id)}
                  />
              </td>
              <td className="email-sender">{email.senderId}</td>
              <td>{email.subject}</td>
              <td className="text-end pe-3">{new Date(email.timestamp).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default EmailList;

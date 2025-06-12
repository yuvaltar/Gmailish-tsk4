import React, { useState } from "react";
import { Table, Form } from "react-bootstrap";
import './EmailList.css';

function EmailList({ setSelectedEmail }) {
  const [emails] = useState([
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

  const [checkedEmails, setCheckedEmails] = useState(new Set());

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
              <td className="email-sender">{email.senderId}</td>
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


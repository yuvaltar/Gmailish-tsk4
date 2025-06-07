import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";

console.log(" EmailList.js is being used ");

function EmailList({ setSelectedEmail }) {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    // For now, simulate a "fetch" with dummy data:
    const dummyEmails = [
      {
        id: 1,
        from: "GitHub",
        subject: "Update",
        body: "Your pull request was merged successfully!",
        date: "Jun 5"
      },
      {
        id: 2,
        from: "GitHub",
        subject: "Update",
        body: "Your pull request was merged successfully!",
        date: "Jun 5"
      },
      {
        id: 3,
        from: "McAfee",
        subject: "You're at risk!",
        body: "Your antivirus subscription has expired.",
        date: "Jun 5"
      }
    ];
    setEmails(dummyEmails);
  }, []); // empty dependency array = run once on mount

  return (
    <div className="w-50 p-3">
    <h1 style={{ color: "red" }}>🔥 THIS IS A TEST 🔥</h1>
    <div className="w-50 p-3">
      <Table hover>
        <tbody>
          {emails.map((email) => (
            <tr
              key={email.id}
              onClick={() => setSelectedEmail(email.id)}
              style={{ cursor: "pointer" }}
            >
              <td><strong>{email.from}</strong></td>
              <td>{email.subject}</td>
              <td className="text-end">{email.date}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
    </div>
  );
}

export default EmailList;

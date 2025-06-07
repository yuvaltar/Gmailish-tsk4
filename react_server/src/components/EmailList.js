// React core hooks
import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";

function EmailList({ setSelectedEmail }) {
  // useState to store emails fetched from the backend
  const [emails, setEmails] = useState([]);

  // useEffect runs once when the component loads
  useEffect(() => {
    // Fetch emails from the Express backend (port 3000)
    const fetchEmails = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/mails", {
          headers: {
            "X-User-Id": localStorage.getItem("userId") // userId comes from login
          }
        });

        if (!res.ok) throw new Error("Failed to fetch mails");
        const data = await res.json();
        setEmails(data); // Save emails in state
      } catch (err) {
        console.error("Inbox fetch error:", err);
      }
    };

    fetchEmails(); // call the fetch function
  }, []); // empty array = run once on mount

  return (
    <div className="w-50 p-3">
      <h1>Inbox</h1>
      <Table hover>
        <tbody>
          {emails.map((email) => (
            <tr
              key={email.id}
              onClick={() => setSelectedEmail(email.id)} // select email ID on click
              style={{ cursor: "pointer" }}
            >
              <td><strong>{email.senderId}</strong></td>
              <td>{email.subject}</td>
              <td className="text-end">{new Date(email.timestamp).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default EmailList;

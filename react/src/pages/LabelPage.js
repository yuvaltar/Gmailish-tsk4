import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function LabelPage() {
  const { labelName } = useParams();
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    const fetchLabelEmails = async () => {
      try {
        const res = await fetch(`/api/labels/${labelName}/emails`, {
          credentials: "include"
        });
        if (!res.ok) throw new Error("Failed to fetch label emails");
        const data = await res.json();
        setEmails(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLabelEmails();
  }, [labelName]);

  return (
    <div className="container mt-4">
      <h2>Label: {labelName}</h2>
      {emails.length === 0 ? (
        <p>No emails under this label.</p>
      ) : (
        <ul>
          {emails.map((email) => (
            <li key={email.id}>
              <strong>{email.subject}</strong> - {email.sender}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LabelPage;

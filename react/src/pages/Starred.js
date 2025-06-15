import React, { useState, useEffect } from "react";
import EmailList from "../components/EmailList";
import MailView from "../components/MailView";
import "./PageStyles.css"; // optional shared styling for layout

function Starred() {
  const [emails, setEmails] = useState([]);
  const [selectedEmailId, setSelectedEmailId] = useState(null);

  useEffect(() => {
    const fetchStarredEmails = async () => {
      try {
        const res = await fetch("/api/labels/star/emails", {
          credentials: "include"
        });
        if (!res.ok) throw new Error("Failed to fetch starred emails");
        const data = await res.json();
        setEmails(data);
      } catch (err) {
        console.error("Error fetching starred emails:", err);
      }
    };

    fetchStarredEmails();
  }, []);

  return (
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-md-5">
          <h2 className="mb-3">Starred</h2>
          <EmailList emails={emails} setSelectedEmail={setSelectedEmailId} />
        </div>
        <div className="col-md-7">
          {selectedEmailId ? (
            <MailView emailId={selectedEmailId} onBack={() => setSelectedEmailId(null)} />
          ) : (
            <div className="placeholder">Select a starred email to view</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Starred;
import React, { useState, useEffect } from "react";
import EmailList from "../components/EmailList";
import MailView from "../components/MailView";


function Draft() {
  const [drafts, setDrafts] = useState([]);
  const [selectedDraftId, setSelectedDraftId] = useState(null);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const res = await fetch("/api/mails?draftsOnly=true", {
          credentials: "include"
        });
        if (!res.ok) throw new Error("Failed to fetch drafts");
        const data = await res.json();
        setDrafts(data);
      } catch (err) {
        console.error("Error fetching drafts:", err);
      }
    };

    fetchDrafts();
  }, []);

  return (
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-md-5">
          <h2 className="mb-3">Drafts</h2>
          <EmailList emails={drafts} setSelectedEmail={setSelectedDraftId} />
        </div>
        <div className="col-md-7">
          {selectedDraftId ? (
            <MailView emailId={selectedDraftId} onBack={() => setSelectedDraftId(null)} />
          ) : (
            <div className="placeholder">Select a draft to view</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Draft;
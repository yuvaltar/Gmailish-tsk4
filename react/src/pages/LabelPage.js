import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EmailList from "../components/EmailList";
import MailView from "../components/MailView";

function LabelPage() {
  const { labelName } = useParams();
  const [emails, setEmails] = useState([]);
  const [selectedEmailId, setSelectedEmailId] = useState(null);

  useEffect(() => {
    const fetchLabelEmails = async () => {
      try {
        const res = await fetch(`/api/labels/${labelName}/emails`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch label emails");
        const data = await res.json();
        setEmails(data);
      } catch (err) {
        console.error(err);
        setEmails([]);
      }
    };

    fetchLabelEmails();
  }, [labelName]);

  return (
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-md-5">
          <h2 className="mb-3">{labelName}</h2>
          <EmailList emails={emails} setSelectedEmail={setSelectedEmailId} />
        </div>
        <div className="col-md-7">
          {selectedEmailId ? (
            <MailView
              emailId={selectedEmailId}
              onBack={() => setSelectedEmailId(null)}
            />
          ) : (
            <div className="placeholder">Select an email to view</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LabelPage;

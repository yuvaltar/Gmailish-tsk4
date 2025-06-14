import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import EmailList from "../components/EmailList";
import MailView from "../components/MailView";
import Compose from "./Compose";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Inbox.css";

function Inbox() {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showCompose, setShowCompose] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  // This function is passed to Header and called on search
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults(null); // Show inbox if search is empty
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:3000/api/mails/search/${encodeURIComponent(query)}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Search failed");
      const results = await res.json();
      setSearchResults(results);
    } catch (err) {
      alert("Search failed: " + err.message);
      setSearchResults([]); // Show empty results on error
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column p-0">
      <Header onSearch={handleSearch} />

      <div className="row flex-grow-1 m-0">
        <div className="col-2 border-end p-0 bg-light">
          <Sidebar onComposeClick={() => setShowCompose(true)} />
        </div>

        <div className="col-10 p-0">
          {selectedEmail ? (
            <MailView emailId={selectedEmail} onBack={() => setSelectedEmail(null)} />
          ) : (
            // Pass searchResults to EmailList if present, otherwise let EmailList fetch inbox
            <EmailList
              setSelectedEmail={setSelectedEmail}
              emails={searchResults}
            />
          )}
        </div>
      </div>

      {showCompose && (
        <div className="compose-box">
          <Compose onClose={() => setShowCompose(false)} />
        </div>
      )}
    </div>
  );
}

export default Inbox;

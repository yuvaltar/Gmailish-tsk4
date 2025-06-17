import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import EmailList from "../components/EmailList";
import MailView from "../components/MailView";
import Compose from "./Compose";
import { BsList } from "react-icons/bs";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Inbox.css";

function Inbox() {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showCompose,  setShowCompose]   = useState(false);
  const [searchResults,setSearchResults] = useState(null);
  const [sidebarOpen,  setSidebarOpen]   = useState(true);   // true = expanded

  const handleSearch = async (query) => {
    if (!query.trim()) { setSearchResults(null); return; }
    try {
      const res = await fetch(
        `http://localhost:3000/api/mails/search/${encodeURIComponent(query)}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Search failed");
      setSearchResults(await res.json());
    } catch (err) {
      alert("Search failed: " + err.message);
      setSearchResults([]);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column p-0">
      <Header onSearch={handleSearch} />

      {/* toggle button */}
      <button
        className="sidebar-toggle-btn gmail-icon-btn position-absolute"
        style={{ top: 13, left: 0, zIndex: 1100 }}
        onClick={() => setSidebarOpen(o => !o)}
        aria-label="Toggle sidebar"
      >
        <BsList size={22} />
      </button>

      <div className="flex-grow-1 d-flex overflow-hidden">
        {/* sidebar column */}
        <div className={`sidebar-fixed border-end ${sidebarOpen ? "bg-light" : "icon-only"}`}>
          <Sidebar
            collapsed={!sidebarOpen}
            onComposeClick={() => setShowCompose(true)}
          />
        </div>

        {/* main panel */}
        <div className="flex-grow-1 overflow-auto">
          {selectedEmail ? (
            <MailView
              emailId={selectedEmail}
              onBack={() => setSelectedEmail(null)}
            />
          ) : (
            <EmailList
              setSelectedEmail={setSelectedEmail}
              emails={searchResults}
            />
          )}
        </div>
      </div>

      {showCompose && <Compose onClose={() => setShowCompose(false)} />}
    </div>
  );
}

export default Inbox;

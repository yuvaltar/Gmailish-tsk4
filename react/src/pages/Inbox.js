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

  const handleBackToInbox = () => {
    setSelectedEmail(null);
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column p-0">
      {/* Search bar still visible for now, but not functional */}
      <Header onSearch={() => {}} />

      <div className="row flex-grow-1 m-0">
        <div className="col-2 border-end p-0 bg-light">
          <Sidebar onComposeClick={() => setShowCompose(true)} />
        </div>

        <div className="col-10 p-0">
          {selectedEmail ? (
            <MailView emailId={selectedEmail} onBack={handleBackToInbox} />
          ) : (
            <EmailList setSelectedEmail={setSelectedEmail} />
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

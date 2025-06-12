import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import EmailList from "../components/EmailList";
import MailView from "../components/MailView";
import Compose from "../pages/Compose";
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
      <Header />
      <div className="row flex-grow-1 m-0">
        <div className="col-2 border-end p-0 bg-light">
          {/* Pass setShowCompose to Sidebar to toggle Compose */}
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


const composeBoxStyle = {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  width: "40vw",
  backgroundColor: "#fff",
  borderRadius: "12px",
  padding: "16px",
  boxShadow: "0 0 10px rgba(0,0,0,0.2)",
  zIndex: 1050
};

export default Inbox;

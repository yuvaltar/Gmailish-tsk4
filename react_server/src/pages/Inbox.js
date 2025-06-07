import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import EmailList from "../components/EmailList";
import MailView from "../components/MailView";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Inbox.css";

function Inbox() {
  const [selectedEmail, setSelectedEmail] = useState(null);

  return (
    <div className="container-fluid vh-100 d-flex flex-column p-0">
      <Header />
      <div className="row flex-grow-1 m-0">
        <div className="col-2 border-end p-0 bg-light">
          <Sidebar />
        </div>
        <div className="col-10 p-0 d-flex">
          <EmailList setSelectedEmail={setSelectedEmail} />
          <div className="flex-grow-1 border-start p-3">
            {selectedEmail ? (
              <MailView email={selectedEmail} />
            ) : (
              <p className="text-muted">Select an email to view</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inbox;

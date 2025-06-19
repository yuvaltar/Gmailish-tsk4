import React from "react";
import { useLocation } from "react-router-dom";
import EmailList from "../components/EmailList";
import MailView from "../components/MailView";

export default function Search() {
  const location = useLocation();
  const { results = [], query = "", label = "inbox" } = location.state || {};
  const [selectedEmail, setSelectedEmail] = React.useState(null);

  if (!location.state) {
    return <p className="p-4">No search query provided.</p>;
  }

  if (selectedEmail) {
    return <MailView emailId={selectedEmail} onBack={() => setSelectedEmail(null)} />;
  }

  return (
    <div className="container mt-4">
      <h4 className="mb-3">
        Search results in "<strong>{label}</strong>" for "<strong>{query}</strong>"
      </h4>
      <EmailList propEmails={results} setSelectedEmail={setSelectedEmail} />
    </div>
  );
}

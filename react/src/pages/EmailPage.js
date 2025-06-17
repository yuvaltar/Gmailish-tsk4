// src/pages/EmailPage.js
import React, { useState } from "react";
import { useParams }      from "react-router-dom";
import EmailList          from "../components/EmailList";
import MailView           from "../components/MailView";

export default function EmailPage() {
  const { labelName } = useParams();           // e.g. "spam", "starred", or undefined
  const folder       = labelName || "inbox";   // default to inbox
  const [selectedEmail, setSelectedEmail] = useState(null);

  if (selectedEmail) {
    return <MailView emailId={selectedEmail} onBack={() => setSelectedEmail(null)} />;
  }
  return (
    <EmailList
      labelFilter={folder}
      propEmails={null}
      setSelectedEmail={setSelectedEmail}
    />
  );
}

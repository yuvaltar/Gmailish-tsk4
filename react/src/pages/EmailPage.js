import React, { useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import EmailList from "../components/EmailList";
import MailView from "../components/MailView";
import LiquidChrome from "../components/LiquidChrome";
import StyledPanel from "../components/StyledPanel";
import Compose from "../pages/Compose";
import "./EmailPage.css";

export default function EmailPage() {
  const { labelName } = useParams();
  const { searchQuery, sidebarCollapsed, darkMode } = useOutletContext();
  const folder = labelName || "inbox";

  const [selectedEmail, setSelectedEmail] = useState(null);
  const [draftOverlay, setDraftOverlay] = useState(null); // holds draft data when overlay is open

  // Intercept row clicks: drafts open as overlay, others go to MailView
  const handleOpenEmail = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/mails/${id}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load mail");
      const mail = await res.json();

      if (mail?.labels?.includes("drafts")) {
        setDraftOverlay({
          id: mail.id,
          to: mail.recipientEmail || mail.recipientId,
          subject: mail.subject || "",
          content: mail.content || "",
        });
      } else {
        setSelectedEmail(id);
      }
    } catch {
      // if anything goes wrong, fallback to opening as normal view
      setSelectedEmail(id);
    }
  };

  const closeDraftOverlay = () => setDraftOverlay(null);

  // Non-draft mails still use the full MailView
  if (selectedEmail) {
    return <MailView emailId={selectedEmail} onBack={() => setSelectedEmail(null)} />;
  }

  return (
    <div className="email-page-wrapper main-content">
      <div className="email-page-inner">
        <StyledPanel>
          <LiquidChrome baseColor={darkMode ? [0.05, 0.15, 0.55] : [0.30, 0.60, 0.95]} />
          <EmailList
            labelFilter={folder}
            searchQuery={searchQuery}
            propEmails={null}
            // IMPORTANT: use our interceptor instead of passing setSelectedEmail directly
            setSelectedEmail={handleOpenEmail}
          />
        </StyledPanel>
      </div>

      {/* Compose overlay only for drafts */}
      {draftOverlay && (
        <div className="compose-overlay">
          <Compose draft={draftOverlay} onClose={closeDraftOverlay} />
        </div>
      )}
    </div>
  );
}

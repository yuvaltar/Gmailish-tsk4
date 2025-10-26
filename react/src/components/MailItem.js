import React, { useEffect, useMemo, useState } from "react";
import { Form } from "react-bootstrap";
import { BsStar, BsStarFill } from "react-icons/bs";
import "./MailItem.css";

async function fetchUserById(id) {
  if (!id) return null;
  try {
    const res = await fetch(`/api/users/${encodeURIComponent(id)}`, { credentials: "include" });
    if (!res.ok) return null;
    return await res.json(); // { id, firstName, lastName, username, ... }
  } catch {
    return null;
  }
}

function MailItem({ email, isChecked, onCheckboxChange, onToggleStar, onClick }) {
  // Hooks must always run
  const [senderProfile, setSenderProfile] = useState(null);

  // Resolve sender profile (guarded inside, but the hook still runs)
  useEffect(() => {
    if (!email) {
      setSenderProfile(null);
      return;
    }
    const senderId = email.senderId || email.sender || email.fromId;
    if (!senderId) {
      setSenderProfile(null);
      return;
    }
    let cancelled = false;
    (async () => {
      const prof = await fetchUserById(senderId);
      if (!cancelled) setSenderProfile(prof);
    })();
    return () => { cancelled = true; };
  }, [email]);

  const { senderDisplayName, senderEmailAddr } = useMemo(() => {
    if (!email) return { senderDisplayName: "", senderEmailAddr: "" };

    const first = senderProfile?.firstName?.trim();
    const last = senderProfile?.lastName?.trim();
    const username = senderProfile?.username?.trim();

    const display =
      [first, last].filter(Boolean).join(" ").trim() ||
      email.senderName ||
      username ||
      email.senderId ||
      "Unknown";

    const emailAddr = username ? `${username}@gmailish.com` : (email.senderEmail || "");

    return { senderDisplayName: display, senderEmailAddr: emailAddr };
  }, [senderProfile, email]);

  // Early return is fine AFTER hooks
  if (!email) return null;

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    onCheckboxChange(email.id);
  };

  const handleStarClick = (e) => {
    e.stopPropagation();
    onToggleStar(email.id);
  };

  const senderTitle = senderEmailAddr
    ? `${senderDisplayName} <${senderEmailAddr}>`
    : senderDisplayName;

  return (
    <tr onClick={() => onClick(email.id)} style={{ cursor: "pointer" }}>
      <td colSpan={3} className="p-0">
        <div
          className={`mail-item email-row-flex d-flex align-items-center justify-content-between w-100 ${
            isChecked ? "table-primary" : ""
          } ${email.read ? "read-mail" : "unread-mail"}`}
        >
          <div className="d-flex align-items-center gap-2 ps-3">
            <Form.Check
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxClick}
              onClick={(e) => e.stopPropagation()}
            />
            <span className="star-cell" onClick={handleStarClick}>
              {email.starred ? (
                <BsStarFill className="star-filled" size={14} />
              ) : (
                <BsStar className="star-empty" size={14} />
              )}
            </span>
          </div>

          <div className="email-snippet-cell flex-grow-1 px-3">
            <div className="sender-name" title={senderTitle}>
              <span className={email.read ? "" : "unread-bold"}>
                {senderDisplayName}
              </span>
            </div>
            <div className="subject-line" title={email.subject}>
              <span className={email.read ? "" : "unread-bold"}>
                {email.subject.length > 80 ? email.subject.slice(0, 77) + "..." : email.subject}
              </span>
            </div>
          </div>

          <div className="email-date pe-3 text-nowrap">
            <span className={email.read ? "" : "unread-bold"}>
              {new Date(email.timestamp).toLocaleDateString()}
            </span>
          </div>
        </div>
      </td>
    </tr>
  );
}

export default MailItem;

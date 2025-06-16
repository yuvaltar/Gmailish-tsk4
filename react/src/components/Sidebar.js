import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import Label from "./Label";
import { Button, ListGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  BsInbox, BsStar, BsSend, BsFileEarmarkText,
  BsExclamationCircle, BsArchive, BsTrash, BsPlus
} from "react-icons/bs";

function Sidebar({ onComposeClick, collapsed }) {
  const navigate = useNavigate();
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [customLabels,  setCustomLabels]    = useState([]);

  /* fetch labels once */
  useEffect(() => {
    (async () => {
      try {
        const r   = await fetch("/api/labels", { credentials: "include" });
        const arr = await r.json();
        setCustomLabels(arr.map(l => l.name));
      } catch (err) { console.error(err); }
    })();
  }, []);

  /* append new label locally (avoid dupes) */
  const addLabel = name => {
    setCustomLabels(prev => (prev.includes(name) ? prev : [...prev, name]));
  };

  /* quick item factory */
  const Item = (to, Icon, text) => (
    <OverlayTrigger
      key={text}
      placement="right"
      overlay={collapsed ? <Tooltip>{text}</Tooltip> : <></>}
    >
      <ListGroup.Item
        action
        className="sidebar-item d-flex align-items-center"
        onClick={() => navigate(to)}
      >
        <Icon className="sidebar-icon" />
        {!collapsed && <span className="ms-2">{text}</span>}
      </ListGroup.Item>
    </OverlayTrigger>
  );

  return (
    <div className={`custom-sidebar d-flex flex-column h-100 p-2 ${collapsed ? "icon-only" : ""}`}>
      {/* Compose (hidden when collapsed) */}
      {!collapsed && (
        <Button
          variant="primary"
          className="mb-3 w-100"
          onClick={onComposeClick}
        >
          Compose ✉️
        </Button>
      )}

      <ListGroup variant="flush" className="flex-grow-1">
        {/* Labels row ‑ plus icon always visible */}
        <ListGroup.Item
          className="d-flex align-items-center sidebar-labels-header"
          action={!collapsed}
          onClick={() => !collapsed && navigate("/labels")}
        >
          <BsFileEarmarkText className="sidebar-icon" />
          {!collapsed && <span className="fw-bold ms-2">Labels</span>}

          <Button
            variant="link"
            size="sm"
            className="ms-auto sidebar-labels-add d-flex align-items-center"
            onClick={e => {
              e.stopPropagation();
              setShowLabelModal(true);
            }}
          >
            <BsPlus size={collapsed ? 18 : 20} />
          </Button>
        </ListGroup.Item>

        {/* built-in folders */}
        {Item("/inbox",   BsInbox,             "Inbox")}
        {Item("/sent",    BsSend,              "Sent")}
        {Item("/drafts",  BsFileEarmarkText,   "Drafts")}
        {Item("/archive", BsArchive,           "Archive")}
        {Item("/starred", BsStar,              "Starred")}
        {Item("/spam",    BsExclamationCircle, "Spam")}
        {Item("/trash",   BsTrash,             "Trash")}

        {/* user labels */}
        {customLabels.map(lbl =>
          Item(`/labels/${encodeURIComponent(lbl)}`, BsFileEarmarkText, lbl)
        )}
      </ListGroup>

      {/* modal for creating a label */}
      <Label
        show={showLabelModal}
        onClose={() => setShowLabelModal(false)}
        onCreate={addLabel}
      />
    </div>
  );
}

export default Sidebar;

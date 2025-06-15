import React, { useEffect, useState } from "react";
import './Sidebar.css';
import Label from "./Label";
import { Button, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { isTokenValid } from "../utils/auth";
import {
  BsInbox,
  BsStar,
  BsSend,
  BsFileEarmarkText,
  BsExclamationCircle
} from "react-icons/bs";

function Sidebar({ onComposeClick }) {
  const navigate = useNavigate();
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [customLabels, setCustomLabels] = useState([]); 

  useEffect(() => {
  const fetchLabels = async () => {
    try {
      const res = await fetch("/api/labels", {
        credentials: "include"
      });
      const data = await res.json();
      setCustomLabels(data.map((label) => label.name));
    } catch (err) {
      console.error("Failed to load labels:", err);
    }
  };

  fetchLabels();
}, []);

  const addLabel = (newLabel) => {
    setCustomLabels((prev) => [...prev, newLabel]);
  };

  return (
    <div className="d-flex flex-column h-100 p-2 custom-sidebar">
      <Button
        variant="primary"
        className="mb-3 w-100"
        onClick={onComposeClick}
      >
        Compose ✉️
      </Button>

      <ListGroup variant="flush">
        {/* Labels Header */}
        <ListGroup.Item
          action
          onClick={() => navigate("/labels")}
          className="d-flex justify-content-between align-items-center sidebar-labels-header"
        >
          <span className="fw-bold">Labels</span>
          <Button
            variant="link"
            size="sm"
            className="p-0 m-0 text-decoration-none sidebar-labels-add"
            onClick={(e) => {
              e.stopPropagation();
              setShowLabelModal(true);
            }}
          >
            +
          </Button>
        </ListGroup.Item>

        {/* Built-in menu items */}
        <ListGroup.Item action onClick={() => navigate("/inbox")} className="sidebar-item">
          <div className="d-flex align-items-center justify-content-between w-100">
            <span>Inbox</span> <BsInbox />
          </div>
        </ListGroup.Item>

        <ListGroup.Item action onClick={() => navigate("/starred")} className="sidebar-item">
          <div className="d-flex align-items-center justify-content-between w-100">
            <span>Starred</span> <BsStar />
          </div>
        </ListGroup.Item>

        <ListGroup.Item action onClick={() => navigate("/sent")} className="sidebar-item">
          <div className="d-flex align-items-center justify-content-between w-100">
            <span>Sent</span> <BsSend />
          </div>
        </ListGroup.Item>

        <ListGroup.Item action onClick={() => navigate("/drafts")} className="sidebar-item">
          <div className="d-flex align-items-center justify-content-between w-100">
            <span>Drafts</span> <BsFileEarmarkText />
          </div>
        </ListGroup.Item>

        <ListGroup.Item action onClick={() => navigate("/spam")} className="sidebar-item">
          <div className="d-flex align-items-center justify-content-between w-100">
            <span>Spam</span> <BsExclamationCircle />
          </div>
        </ListGroup.Item>

        {/* Custom labels go here */}
        {customLabels.map((label, index) => (
          <ListGroup.Item
            key={index}
            action
            onClick={() => navigate(`/label/${encodeURIComponent(label)}`)}
            className="sidebar-item"
          >
            <div className="d-flex align-items-center justify-content-between w-100">
              <span>{label}</span>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Label Modal */}
      <Label
        show={showLabelModal}
        onClose={() => setShowLabelModal(false)}
        onCreate={addLabel} // 🟢 pass the callback
      />
    </div>
  );
}
export default Sidebar;

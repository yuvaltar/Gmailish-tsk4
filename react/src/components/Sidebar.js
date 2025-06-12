import React, { useState } from "react";
import './Sidebar.css';
import NewLabelModal from "./NewLabelModal";
import { Button, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  BsInbox,
  BsStar,
  BsSend,
  BsFileEarmarkText,
  BsExclamationCircle
} from "react-icons/bs";

function Sidebar({ onComposeClick }) {
  const navigate = useNavigate();
  const [showLabelModal, setShowLabelModal] = useState(false); // 🟢 control modal

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
            <ListGroup.Item className="d-flex justify-content-between align-items-center sidebar-labels-header">
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


        {/* Menu Items */}
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
      </ListGroup>

      {/* Label Modal component (mounted once here) */}
      <NewLabelModal show={showLabelModal} onClose={() => setShowLabelModal(false)} />
    </div>
  );
}

export default Sidebar;
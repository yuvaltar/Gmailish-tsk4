import React from "react";
import { Button, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Sidebar({ onComposeClick }) {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column h-100 p-2">
      
      <Button
        variant="primary"
        className="mb-3 w-100"
        onClick={onComposeClick} 
      >
        Compose
      </Button>

      {/* Sidebar sections with clickable navigation */}
      <ListGroup variant="flush">
        <ListGroup.Item action onClick={() => navigate("/inbox")}>Inbox</ListGroup.Item>
        <ListGroup.Item action onClick={() => navigate("/starred")}>Starred</ListGroup.Item>
        <ListGroup.Item action onClick={() => navigate("/labels")}>Labels</ListGroup.Item>
        <ListGroup.Item action onClick={() => navigate("/sent")}>Sent</ListGroup.Item>
        <ListGroup.Item action onClick={() => navigate("/drafts")}>Drafts</ListGroup.Item>
        <ListGroup.Item action onClick={() => navigate("/spam")}>Spam</ListGroup.Item>
      </ListGroup>
    </div>
  );
}

export default Sidebar;

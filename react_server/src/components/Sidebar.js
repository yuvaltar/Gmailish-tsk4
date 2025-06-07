import React from "react";
import { Button, ListGroup } from "react-bootstrap";

function Sidebar() {
  return (
    <div className="d-flex flex-column h-100 p-2">
      <Button variant="primary" className="mb-3 w-100">
        Compose
      </Button>
      <ListGroup variant="flush">
        <ListGroup.Item action active>Inbox</ListGroup.Item>
        <ListGroup.Item action>Starred</ListGroup.Item>
        <ListGroup.Item action>Sent</ListGroup.Item>
        <ListGroup.Item action>Drafts</ListGroup.Item>
        <ListGroup.Item action>Trash</ListGroup.Item>
      </ListGroup>
    </div>
  );
}

export default Sidebar;

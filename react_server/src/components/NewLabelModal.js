import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function NewLabelModal({ show, onClose }) {
  const [labelName, setLabelName] = useState("");

  const handleCreate = () => {
    if (labelName.trim()) {
      console.log("New label created:", labelName);
      // TODO: send to backend or store state
      setLabelName("");
      onClose();
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>New label</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Please enter a new label name:</Form.Label>
          <Form.Control
            type="text"
            value={labelName}
            onChange={(e) => setLabelName(e.target.value)}
            placeholder="Label name"
          />
        </Form.Group>
        <Form.Check
          type="checkbox"
          label="Nest label under"
          className="mt-3"
          disabled
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleCreate}
          disabled={!labelName.trim()}
        >
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default NewLabelModal;

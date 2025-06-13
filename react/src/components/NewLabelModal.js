import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function NewLabelModal({ show, onClose }) {
  const [labelName, setLabelName] = useState("");

  const handleCreate = async () => {
    if (!labelName.trim()) return;

    try {
      const res = await fetch("http://localhost:3000/api/labels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ name: labelName.trim() })
      });

      if (!res.ok) throw new Error("Failed to create label");

      console.log("Label created successfully");
      setLabelName("");
      onClose();
    } catch (err) {
      console.error("Label creation error:", err);
      alert("Failed to create label");
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

import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function Label({ show, onClose, onCreate }) {
  const [labelName, setLabelName] = useState("");

  const handleCreate = async () => {
    if (!labelName.trim()) return;

    try {
      const res = await fetch("/api/labels", {
        method: "POST",
        credentials: "include", // ✅ Send cookie
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: labelName.trim() })
      });

      if (!res.ok) {
        if (res.status === 401) {
          alert("You must be logged in to create a label.");
        } else {
          throw new Error("Label creation failed");
        }
        return;
      }

      onCreate(labelName.trim());
      setLabelName("");
      onClose();
    } catch (err) {
      alert("Failed to create label: " + err.message);
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

export default Label;

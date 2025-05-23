const { v4: uuidv4 } = require('uuid');
const labels = [];

// GET /api/labels
exports.getAllLabels = (req, res) => {
  res.status(200).json(labels);
};

// POST /api/labels
exports.createLabel = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  const newLabel = { id: uuidv4(), name };
  labels.push(newLabel);
  res.status(201).location(`/api/labels/${newLabel.id}`).end();
};

// GET /api/labels/:id
exports.getLabel = (req, res) => {
  const label = labels.find(l => l.id === req.params.id);
  if (!label) return res.status(404).json({ error: 'Label not found' });
  res.status(200).json(label);
};

// PATCH /api/labels/:id
exports.updateLabel = (req, res) => {
  const label = labels.find(l => l.id === req.params.id);
  if (!label) return res.status(404).json({ error: 'Label not found' });

  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  label.name = name;
  res.status(204).end();
};

// DELETE /api/labels/:id
exports.deleteLabel = (req, res) => {
  const index = labels.findIndex(l => l.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Label not found' });

  labels.splice(index, 1);
  res.status(204).end();
};
//Setup: You’ll need a models/user.js like this: why?
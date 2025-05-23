const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Route registration
app.use('/api/blacklist', require('./routes/blacklist'));
app.use('/api/users', require('./routes/users'));
app.use('/api/mails', require('./routes/mails'));
app.use('/api/labels', require('./routes/labels'));
app.use('/api/tokens', require('./routes/tokens'));

// 404 handler for unknown routes (JSON only)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Launch the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

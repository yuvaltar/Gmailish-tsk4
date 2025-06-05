// creates your Node.js HTTP server and Load the Express library
const express = require('express');
// Create an instance of the Express app
const app = express();
//Choose the port to listen on. If there's an environment variable PORT,
// use that. Otherwise use 3000.
const PORT = process.env.PORT || 3000;

const cors = require('cors');
app.use(cors());
// Middleware to parse JSON request bodies into java script
//  obect called req.body
app.use(express.json());

// Route registration
app.use('/api/blacklist', require('./web/routes/blacklist'));
app.use('/api/users', require('./web/routes/users'));
app.use('/api/mails', require('./web/routes/mails'));
app.use('/api/labels', require('./web/routes/labels'));
app.use('/api/tokens', require('./web/routes/tokens'));


// 404 handler for unknown routes (JSON only)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Launch the server -> so users can talk to us
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

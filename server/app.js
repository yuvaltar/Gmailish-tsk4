require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000; // Keep port 3000 for serving both backend and React

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// API route registration
app.use("/api/blacklist", require("./routes/blacklist"));
app.use("/api/users", require("./routes/users"));
app.use("/api/mails", require("./routes/mails"));
app.use("/api/labels", require("./routes/labels"));
app.use("/api/tokens", require("./routes/tokens"));

// Serve static React build
app.use(express.static(path.join(__dirname, "../react/build")));

// Root path serves React app (React will redirect based on token)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../react/build/index.html"));
});



// Optional: remove or keep this
app.get("/ping", (req, res) => {
  res.json({ msg: "pong" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

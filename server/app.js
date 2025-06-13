require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "http://localhost:3001",  // React frontend
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

// 🔥 Fix: serve static files from uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/blacklist", require("./routes/blacklist"));
app.use("/api/users", require("./routes/users"));
app.use("/api/mails", require("./routes/mails"));
app.use("/api/labels", require("./routes/labels"));
app.use("/api/tokens", require("./routes/tokens"));

// Static React build (optional)
app.use(express.static(path.join(__dirname, "../react/build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../react/build/index.html"));
});

app.get("/ping", (req, res) => {
  res.json({ msg: "pong" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

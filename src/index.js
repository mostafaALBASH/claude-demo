const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

require("dotenv").config();

const taskRoutes = require("./routes/tasks");
const userRoutes = require("./routes/users");
const { initDatabase } = require("./models/db");

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// routes
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// quick landing page so you know it's running
app.get("/", (_req, res) => {
  res.send(`
    <h1>TaskFlow API</h1>
    <p>Demo project for <strong>Claude Code in Action</strong></p>
    <ul>
      <li><a href="/api/health">/api/health</a></li>
      <li><a href="/api/tasks">/api/tasks</a></li>
      <li><a href="/api/users">/api/users</a></li>
    </ul>
  `);
});

// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// global error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

// boot
initDatabase();
app.listen(PORT, () => {
  console.log(`TaskFlow running → http://localhost:${PORT}`);
});

module.exports = app;

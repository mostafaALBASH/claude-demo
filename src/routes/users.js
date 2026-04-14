const express = require("express");
const router = express.Router();
const { getDb } = require("../models/db");

// GET /api/users
router.get("/", (_req, res) => {
  const db = getDb();
  const users = db.prepare("SELECT * FROM users ORDER BY name").all();
  res.json(users);
});

// GET /api/users/:id
router.get("/:id", (req, res) => {
  const db = getDb();
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);

  if (!user) return res.status(404).json({ error: "User not found" });

  // include their tasks
  const tasks = db
    .prepare("SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC")
    .all(req.params.id);

  res.json({ ...user, tasks });
});

// POST /api/users
router.post("/", (req, res) => {
  const db = getDb();
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  try {
    const result = db
      .prepare("INSERT INTO users (name, email) VALUES (?, ?)")
      .run(name, email);
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(result.lastInsertRowid);
    res.status(201).json(user);
  } catch (err) {
    if (err.message.includes("UNIQUE")) {
      return res.status(409).json({ error: "Email already exists" });
    }
    throw err;
  }
});

// DELETE /api/users/:id
router.delete("/:id", (req, res) => {
  const db = getDb();
  const result = db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id);

  if (result.changes === 0) return res.status(404).json({ error: "User not found" });
  res.json({ deleted: true });
});

module.exports = router;

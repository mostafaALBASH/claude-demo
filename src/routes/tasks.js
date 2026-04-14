const express = require("express");
const router = express.Router();
const { getDb } = require("../models/db");

// GET /api/tasks — list all tasks (optional ?status= filter)
router.get("/", (req, res) => {
  const db = getDb();
  const { status, priority } = req.query;

  let sql = "SELECT * FROM tasks WHERE 1=1";
  const params = [];

  if (status) {
    sql += " AND status = ?";
    params.push(status);
  }
  if (priority) {
    sql += " AND priority = ?";
    params.push(priority);
  }
  sql += " ORDER BY created_at DESC";

  const tasks = db.prepare(sql).all(...params);
  res.json(tasks);
});

// GET /api/tasks/:id
router.get("/:id", (req, res) => {
  const db = getDb();
  const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(req.params.id);

  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json(task);
});

// POST /api/tasks
router.post("/", (req, res) => {
  const db = getDb();
  const { title, description, status, priority, user_id } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const result = db
    .prepare(
      `INSERT INTO tasks (title, description, status, priority, user_id)
       VALUES (?, ?, ?, ?, ?)`
    )
    .run(
      title,
      description || "",
      status || "todo",
      priority || "medium",
      user_id || null
    );

  const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(task);
});

// PATCH /api/tasks/:id
router.patch("/:id", (req, res) => {
  const db = getDb();
  const existing = db.prepare("SELECT * FROM tasks WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Task not found" });

  const fields = ["title", "description", "status", "priority", "user_id"];
  const updates = [];
  const values = [];

  for (const field of fields) {
    if (req.body[field] !== undefined) {
      updates.push(`${field} = ?`);
      values.push(req.body[field]);
    }
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  updates.push("updated_at = datetime('now')");
  values.push(req.params.id);

  db.prepare(`UPDATE tasks SET ${updates.join(", ")} WHERE id = ?`).run(...values);

  const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(req.params.id);
  res.json(task);
});

// DELETE /api/tasks/:id
router.delete("/:id", (req, res) => {
  const db = getDb();
  const result = db.prepare("DELETE FROM tasks WHERE id = ?").run(req.params.id);

  if (result.changes === 0) return res.status(404).json({ error: "Task not found" });
  res.json({ deleted: true });
});

module.exports = router;

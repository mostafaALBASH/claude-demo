const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const DB_PATH = process.env.DB_PATH || "./data/taskflow.db";

let db;

function getDb() {
  if (!db) {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
  }
  return db;
}

function initDatabase() {
  const conn = getDb();

  conn.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT    NOT NULL,
      email      TEXT    NOT NULL UNIQUE,
      created_at TEXT    DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT    NOT NULL,
      description TEXT    DEFAULT '',
      status      TEXT    DEFAULT 'todo' CHECK(status IN ('todo','in_progress','done')),
      priority    TEXT    DEFAULT 'medium' CHECK(priority IN ('low','medium','high')),
      user_id     INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at  TEXT    DEFAULT (datetime('now')),
      updated_at  TEXT    DEFAULT (datetime('now'))
    );
  `);

  // seed a couple of rows so the API isn't empty on first run
  const count = conn.prepare("SELECT COUNT(*) as n FROM users").get();
  if (count.n === 0) {
    conn
      .prepare("INSERT INTO users (name, email) VALUES (?, ?)")
      .run("Ada Lovelace", "ada@example.com");
    conn
      .prepare("INSERT INTO users (name, email) VALUES (?, ?)")
      .run("Alan Turing", "alan@example.com");

    conn
      .prepare(
        "INSERT INTO tasks (title, description, status, priority, user_id) VALUES (?, ?, ?, ?, ?)"
      )
      .run("Set up project", "Initialize repo and install deps", "done", "high", 1);
    conn
      .prepare(
        "INSERT INTO tasks (title, description, status, priority, user_id) VALUES (?, ?, ?, ?, ?)"
      )
      .run("Write API routes", "CRUD endpoints for tasks and users", "in_progress", "high", 1);
    conn
      .prepare(
        "INSERT INTO tasks (title, description, status, priority, user_id) VALUES (?, ?, ?, ?, ?)"
      )
      .run("Add auth middleware", "JWT-based authentication layer", "todo", "medium", 2);
  }

  console.log("Database ready →", DB_PATH);
}

module.exports = { getDb, initDatabase };

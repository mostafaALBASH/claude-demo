const { describe, it, before, after } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");

// helper — tiny http client for our local server
function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: "localhost",
      port: process.env.PORT || 3000,
      path,
      method,
      headers: { "Content-Type": "application/json" },
    };

    const req = http.request(opts, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

describe("TaskFlow API", () => {
  it("GET /api/health returns ok", async () => {
    const res = await request("GET", "/api/health");
    assert.equal(res.status, 200);
    assert.equal(res.body.status, "ok");
  });

  it("GET /api/tasks returns an array", async () => {
    const res = await request("GET", "/api/tasks");
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
  });

  it("POST /api/tasks creates a new task", async () => {
    const res = await request("POST", "/api/tasks", {
      title: "Test task from Node runner",
      priority: "high",
    });
    assert.equal(res.status, 201);
    assert.equal(res.body.title, "Test task from Node runner");
    assert.equal(res.body.priority, "high");
  });

  it("POST /api/tasks without title returns 400", async () => {
    const res = await request("POST", "/api/tasks", { description: "no title" });
    assert.equal(res.status, 400);
  });

  it("GET /api/tasks/:id returns a single task", async () => {
    const res = await request("GET", "/api/tasks/1");
    assert.equal(res.status, 200);
    assert.ok(res.body.title);
  });

  it("PATCH /api/tasks/:id updates fields", async () => {
    const res = await request("PATCH", "/api/tasks/1", { status: "done" });
    assert.equal(res.status, 200);
    assert.equal(res.body.status, "done");
  });

  it("GET /api/users returns seeded users", async () => {
    const res = await request("GET", "/api/users");
    assert.equal(res.status, 200);
    assert.ok(res.body.length >= 2);
  });

  it("404 for unknown routes", async () => {
    const res = await request("GET", "/api/nonexistent");
    assert.equal(res.status, 404);
  });
});

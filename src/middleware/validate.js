/**
 * Basic request-validation middleware.
 *
 * Exercise note: the security hook in Lesson 12 will
 * complement this by blocking writes to sensitive files
 * at the Claude Code level.
 */

function requireJson(req, res, next) {
  if (
    req.method !== "GET" &&
    req.method !== "DELETE" &&
    !req.is("application/json")
  ) {
    return res.status(415).json({ error: "Content-Type must be application/json" });
  }
  next();
}

function validateTaskBody(req, res, next) {
  const { title } = req.body;
  if (req.method === "POST" && (!title || title.trim().length === 0)) {
    return res.status(400).json({ error: "title cannot be empty" });
  }
  next();
}

module.exports = { requireJson, validateTaskBody };

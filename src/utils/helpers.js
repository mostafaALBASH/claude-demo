/**
 * Shared utility functions for TaskFlow.
 *
 * Intentionally kept small — Claude Code exercises will
 * ask you to extend this file with new helpers.
 */

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

function paginate(items, page = 1, perPage = 20) {
  const start = (page - 1) * perPage;
  return {
    data: items.slice(start, start + perPage),
    meta: {
      page,
      perPage,
      total: items.length,
      totalPages: Math.ceil(items.length / perPage),
    },
  };
}

// rough input sanitizer — strips html tags
function sanitize(str) {
  if (typeof str !== "string") return str;
  return str.replace(/<[^>]*>/g, "").trim();
}

module.exports = { slugify, paginate, sanitize };

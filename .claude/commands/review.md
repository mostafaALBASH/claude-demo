Review the code in this project for potential issues. Focus on:

1. Security vulnerabilities (SQL injection, missing input validation, exposed secrets)
2. Error handling gaps (unhandled promise rejections, missing try/catch blocks)
3. Performance concerns (N+1 queries, unnecessary synchronous operations)
4. Code style inconsistencies compared to the conventions in CLAUDE.md

Start with the routes in `src/routes/` since those handle user input directly.
Give concrete suggestions with before/after code snippets.

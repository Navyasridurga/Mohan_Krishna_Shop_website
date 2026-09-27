/**
 * Database connection.
 *
 * Dev: SQLite via better-sqlite3 (file-based, zero setup).
 * Production-ready path: replace the body of this file with a `pg` Pool
 * and expose the same shape (get/all/run/exec) so the rest of the app
 * (controllers) never needs to change. Controllers only use plain SQL,
 * written to be Postgres-compatible (no SQLite-only syntax beyond
 * AUTOINCREMENT, which has a documented Postgres equivalent - SERIAL).
 */
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const dbPath = process.env.SQLITE_PATH || path.join(__dirname, '..', 'database', 'mohan_krishna.db');

// Ensure the database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

/**
 * Initialize schema if tables do not already exist.
 * Idempotent - safe to call every server start.
 */
function initSchema() {
  const schema = fs.readFileSync(path.join(__dirname, '..', 'database', 'schema.sql'), 'utf8');
  db.exec(schema);
}

module.exports = { db, initSchema };

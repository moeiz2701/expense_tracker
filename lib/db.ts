import Database from "better-sqlite3";
import path from "path";

const db = new Database(path.join(process.cwd(), "expenses.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    amount REAL NOT NULL CHECK (amount > 0),
    category TEXT NOT NULL CHECK (category IN ('food', 'transport', 'utilities', 'other')),
    date TEXT NOT NULL,
    createdAt TEXT NOT NULL
  )
`);

export default db;

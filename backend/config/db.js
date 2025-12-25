import { Pool } from "pg";
import { PGHOST, PGPORT, PGUSER, PGPASSWORD } from './env';

export function createPool() {
  const pool = new Pool({
    host: PGHOST,
    port: Number(PGPORT),
    user: PGUSER,
    password: PGPASSWORD,
    database: PGDATABASE,
  });

  // Optional: basic connection check (runs once)
  pool.on("connect", () => {
    console.log("📦 Connected to PostgreSQL");
  });

  pool.on("error", (err) => {
    console.error("Unexpected PG error", err);
    process.exit(1);
  });

  return pool;
}

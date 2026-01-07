import "dotenv/config";
import { Pool } from "pg";

export function createPool() {
  const pool = new Pool({
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  });

  pool.on("error", (err) => {
    console.error("Unexpected PG error", err);
    process.exit(1);
  });

  pool.query("SELECT NOW()")
    .then(() => console.log("✅ Database connection verified"))
    .catch((err) => console.error("❌ Database connection failed:", err));

  return pool;
}

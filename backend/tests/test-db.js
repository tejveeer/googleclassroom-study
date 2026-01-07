import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { Pool } from "pg";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaPath = path.resolve(__dirname, "../migrations/schema.sql");

export async function startTestDb() {
  const container = await new PostgreSqlContainer("postgres:16-alpine").start();

  const pool = new Pool({
    host: container.getHost(),
    port: container.getPort(),
    user: container.getUsername(),
    password: container.getPassword(),
    database: container.getDatabase(),
  });

  const schemaSql = await fs.readFile(schemaPath, "utf8");
  await pool.query(schemaSql);

  return { container, pool };
}

export async function stopTestDb(container, pool) {
  if (pool) await pool.end();
  if (container) await container.stop();
}

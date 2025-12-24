import { createPool } from '../config/db.js';

export function createDependencies() {
  const pool = createPool();

  return {
    pool,
  };
}
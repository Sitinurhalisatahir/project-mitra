import { Pool } from 'pg';

// Reuse pool saat hot-reload di mode dev
const g = globalThis;
export const pool =
  g._pgPool ?? (g._pgPool = new Pool({ connectionString: process.env.DATABASE_URL }));

export const query = (text, params) => pool.query(text, params);

// Jalankan beberapa query dalam satu transaksi
export async function tx(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

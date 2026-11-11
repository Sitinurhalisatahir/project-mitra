import { Pool, types } from 'pg';

// Kolom DATE (mis. deadline) dikembalikan apa adanya 'YYYY-MM-DD'.
// Default pg mengubahnya jadi Date lokal sehingga di zona waktu non-UTC (mis. WITA)
// tanggal bisa bergeser satu hari saat di-serialisasi ke JSON.
types.setTypeParser(1082, (v) => v);

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

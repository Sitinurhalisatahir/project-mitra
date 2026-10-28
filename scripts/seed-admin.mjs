// node --env-file=.env.local scripts/seed-admin.mjs
import pg from 'pg';
import bcrypt from 'bcryptjs';

const c = new pg.Client({ connectionString: process.env.DATABASE_URL });
await c.connect();
const email = process.env.ADMIN_EMAIL || 'admin@kampus.ac.id';
const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin12345', 10);
await c.query(
  `INSERT INTO pengguna (nim, nama, email, password_hash, role, is_verified)
   VALUES ('ADMIN', 'Administrator', $1, $2, 'admin', TRUE) ON CONFLICT (email) DO NOTHING`,
  [email, hash]
);
console.log('Admin siap:', email);
await c.end();

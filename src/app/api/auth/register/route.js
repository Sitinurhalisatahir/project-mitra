import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { query } from '@/lib/db';
import { route, ok, body } from '@/lib/api';

const schema = z.object({
  nim: z.string().min(1).max(20),
  nama: z.string().min(1).max(100),
  email: z.string().email().max(100),
  password: z.string().min(8, 'Minimal 8 karakter'),
  jurusan: z.string().max(100).optional(),
  angkatan: z.number().int().optional(),
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrasi mahasiswa baru
 *     tags:
 *     - Auth
 *     description: Role selalu 'mahasiswa' dan is_verified=false sampai disetujui admin.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *             - nim
 *             - nama
 *             - email
 *             - password
 *             properties:
 *               nim:
 *                 type: string
 *                 maxLength: 20
 *               nama:
 *                 type: string
 *                 maxLength: 100
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 100
 *               password:
 *                 type: string
 *                 minLength: 8
 *               jurusan:
 *                 type: string
 *                 maxLength: 100
 *               angkatan:
 *                 type: integer
 *     responses:
 *       '201':
 *         description: Akun dibuat (menunggu verifikasi admin)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/Pengguna'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 */
// Registrasi: role selalu 'mahasiswa', is_verified=false sampai disetujui admin
export const POST = route(async ({ req }) => {
  const d = await body(req, schema);
  const hash = await bcrypt.hash(d.password, 10);
  const { rows } = await query(
    `INSERT INTO pengguna (nim, nama, email, password_hash, jurusan, angkatan)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING pengguna_id, nim, nama, email, jurusan, angkatan, role, is_verified, created_at`,
    [d.nim, d.nama, d.email.toLowerCase(), hash, d.jurusan ?? null, d.angkatan ?? null]
  );
  return ok({ user: rows[0] }, 201);
});

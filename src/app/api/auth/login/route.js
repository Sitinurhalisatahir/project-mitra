import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { query } from '@/lib/db';
import { route, ok, body, ApiError } from '@/lib/api';
import { signToken } from '@/lib/auth';

const schema = z.object({
  identifier: z.string().min(1), // email atau NIM
  password: z.string().min(1),
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login dengan email atau NIM
 *     tags:
 *     - Auth
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *             - identifier
 *             - password
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: Email atau NIM
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/AuthUser'
 *                     token:
 *                       type: string
 *                       description: JWT untuk header Authorization Bearer
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 */
export const POST = route(async ({ req }) => {
  const { identifier, password } = await body(req, schema);
  const { rows } = await query(
    `SELECT pengguna_id, nim, nama, email, password_hash, role, is_verified
     FROM pengguna WHERE lower(email) = lower($1) OR nim = $1`,
    [identifier]
  );
  const u = rows[0];
  if (!u || !(await bcrypt.compare(password, u.password_hash)))
    throw new ApiError(401, 'Email/NIM atau password salah');
  if (!u.is_verified && u.role !== 'admin')
    throw new ApiError(403, 'Akun Anda masih menunggu verifikasi dari admin');
  const { password_hash, ...user } = u;
  return ok({ user, token: signToken(user) });
});

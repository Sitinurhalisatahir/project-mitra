import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { query } from '@/lib/db';
import { route, ok, body, ApiError } from '@/lib/api';

const passwordSchema = z.object({
  password_lama: z.string().min(1, 'Password lama wajib diisi'),
  password_baru: z.string().min(8, 'Password baru minimal 8 karakter'),
});

/**
 * @swagger
 * /api/auth/password:
 *   put:
 *     summary: Ubah password akun
 *     tags:
 *     - Auth
 *     security:
 *     - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *             - password_lama
 *             - password_baru
 *             properties:
 *               password_lama:
 *                 type: string
 *               password_baru:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Berhasil
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 */
export const PUT = route(
  async ({ req, user }) => {
    const { password_lama, password_baru } = await body(req, passwordSchema);

    // Ambil data hash password pengguna
    const { rows } = await query(
      'SELECT password_hash FROM pengguna WHERE pengguna_id = $1',
      [user.pengguna_id]
    );

    if (!rows[0] || !(await bcrypt.compare(password_lama, rows[0].password_hash))) {
      throw new ApiError(400, 'Password saat ini (lama) salah');
    }

    const newHash = await bcrypt.hash(password_baru, 10);
    await query('UPDATE pengguna SET password_hash = $1 WHERE pengguna_id = $2', [
      newHash,
      user.pengguna_id,
    ]);

    return ok({ message: 'Password berhasil diperbarui' });
  },
  { auth: true }
);


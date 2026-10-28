import { z } from 'zod';
import { query } from '@/lib/db';
import { route, ok, body, intParam, ApiError } from '@/lib/api';

/**
 * @swagger
 * /api/admin/pengguna/{id}:
 *   patch:
 *     summary: Verifikasi / cabut verifikasi akun
 *     tags:
 *     - Admin
 *     description: Khusus admin.
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *     - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               is_verified:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       '200':
 *         description: Berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/AuthUser'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 */
// Verifikasi akun: body { "is_verified": true|false } (default true)
export const PATCH = route(async ({ req, params }) => {
  const { is_verified } = await body(req, z.object({ is_verified: z.boolean().default(true) }));
  const { rows } = await query(
    `UPDATE pengguna SET is_verified = $1 WHERE pengguna_id = $2
     RETURNING pengguna_id, nim, nama, email, role, is_verified`,
    [is_verified, intParam(params.id)]
  );
  if (!rows[0]) throw new ApiError(404, 'Pengguna tidak ditemukan');
  return ok(rows[0]);
}, { admin: true });

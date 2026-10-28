import { query } from '@/lib/db';
import { route, ok, intParam, ApiError } from '@/lib/api';

/**
 * @swagger
 * /api/notifikasi/{id}:
 *   patch:
 *     summary: Tandai satu notifikasi sebagai dibaca
 *     tags:
 *     - Notifikasi
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *     - $ref: '#/components/parameters/Id'
 *     responses:
 *       '200':
 *         description: Berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Notifikasi'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 */
export const PATCH = route(async ({ user, params }) => {
  const { rows } = await query(
    'UPDATE notifikasi SET is_read = TRUE WHERE notifikasi_id = $1 AND pengguna_id = $2 RETURNING *',
    [intParam(params.id), user.pengguna_id]
  );
  if (!rows[0]) throw new ApiError(404, 'Notifikasi tidak ditemukan');
  return ok(rows[0]);
}, { auth: true });

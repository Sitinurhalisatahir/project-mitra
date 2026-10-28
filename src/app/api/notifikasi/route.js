import { query } from '@/lib/db';
import { route, ok } from '@/lib/api';
import { paging, paged } from '@/lib/sql';

/**
 * @swagger
 * /api/notifikasi:
 *   get:
 *     summary: Daftar notifikasi saya
 *     tags:
 *     - Notifikasi
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *     - in: query
 *       name: unread
 *       schema:
 *         type: boolean
 *       description: true = hanya yang belum dibaca
 *     - $ref: '#/components/parameters/Page'
 *     - $ref: '#/components/parameters/Limit'
 *     responses:
 *       '200':
 *         description: Berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notifikasi'
 *                 meta:
 *                   allOf:
 *                   - $ref: '#/components/schemas/Meta'
 *                   - type: object
 *                     properties:
 *                       unread_count:
 *                         type: integer
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 */
// ?unread=true&page=&limit=
export const GET = route(async ({ req, user }) => {
  const sp = new URL(req.url).searchParams;
  const pg = paging(sp);
  const unread = sp.get('unread') === 'true';
  const { rows } = await query(
    `SELECT notifikasi_id, tipe, isi, is_read, created_at, COUNT(*) OVER()::int AS total
     FROM notifikasi WHERE pengguna_id = $1 AND ($2::boolean IS FALSE OR NOT is_read)
     ORDER BY created_at DESC, notifikasi_id DESC LIMIT $3 OFFSET $4`,
    [user.pengguna_id, unread, pg.limit, pg.offset]
  );
  const { rows: [c] } = await query(
    'SELECT COUNT(*)::int AS n FROM notifikasi WHERE pengguna_id = $1 AND NOT is_read', [user.pengguna_id]);
  const { items, meta } = paged(rows, pg);
  return ok(items, 200, { ...meta, unread_count: c.n });
}, { auth: true });

/**
 * @swagger
 * /api/notifikasi:
 *   patch:
 *     summary: Tandai semua notifikasi sebagai dibaca
 *     tags:
 *     - Notifikasi
 *     security:
 *     - bearerAuth: []
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
 *                     updated:
 *                       type: integer
 *                       description: Jumlah notifikasi yang diperbarui
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 */
// Tandai semua notifikasi sebagai dibaca
export const PATCH = route(async ({ user }) => {
  const { rowCount } = await query(
    'UPDATE notifikasi SET is_read = TRUE WHERE pengguna_id = $1 AND NOT is_read', [user.pengguna_id]);
  return ok({ updated: rowCount });
}, { auth: true });

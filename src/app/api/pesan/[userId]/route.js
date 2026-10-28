import { query } from '@/lib/db';
import { route, ok, intParam } from '@/lib/api';

/**
 * @swagger
 * /api/pesan/{userId}:
 *   get:
 *     summary: Riwayat chat dengan satu pengguna
 *     tags:
 *     - Pesan
 *     description: Pesan masuk otomatis ditandai sudah dibaca. Urut dari lama ke baru. Frontend bisa polling endpoint ini.
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *     - in: path
 *       name: userId
 *       required: true
 *       schema:
 *         type: integer
 *     - in: query
 *       name: limit
 *       schema:
 *         type: integer
 *         default: 50
 *         maximum: 100
 *     - in: query
 *       name: before
 *       schema:
 *         type: integer
 *       description: pesan_id; ambil pesan yang lebih lama dari ini
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
 *                     $ref: '#/components/schemas/Pesan'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 */
// Riwayat chat dengan satu pengguna; otomatis menandai pesan masuk sebagai dibaca.
// ?limit=50&before=<pesan_id> (untuk load pesan lama). Frontend bisa polling endpoint ini.
export const GET = route(async ({ req, user, params }) => {
  const lawan = intParam(params.userId, 'userId');
  const sp = new URL(req.url).searchParams;
  const limit = Math.min(100, parseInt(sp.get('limit')) || 50);
  const before = parseInt(sp.get('before')) || null;

  await query(
    'UPDATE pesan SET is_read = TRUE WHERE pengirim_id = $1 AND penerima_id = $2 AND NOT is_read',
    [lawan, user.pengguna_id]
  );
  const { rows } = await query(
    `SELECT * FROM (
       SELECT pesan_id, pengirim_id, penerima_id, isi_pesan, sent_at, is_read FROM pesan
       WHERE ((pengirim_id = $1 AND penerima_id = $2) OR (pengirim_id = $2 AND penerima_id = $1))
         AND ($3::int IS NULL OR pesan_id < $3)
       ORDER BY pesan_id DESC LIMIT $4
     ) t ORDER BY pesan_id ASC`,
    [user.pengguna_id, lawan, before, limit]
  );
  return ok(rows);
}, { auth: true });

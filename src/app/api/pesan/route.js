import { z } from 'zod';
import { query, tx } from '@/lib/db';
import { route, ok, body, ApiError } from '@/lib/api';

const schema = z.object({
  penerima_id: z.number().int().positive(),
  isi_pesan: z.string().min(1).max(5000),
});

/**
 * @swagger
 * /api/pesan:
 *   get:
 *     summary: Daftar percakapan
 *     tags:
 *     - Pesan
 *     description: Pesan terakhir per lawan bicara beserta jumlah pesan belum dibaca.
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       lawan_id:
 *                         type: integer
 *                       lawan_nama:
 *                         type: string
 *                       isi_pesan:
 *                         type: string
 *                       sent_at:
 *                         type: string
 *                         format: date-time
 *                       belum_dibaca:
 *                         type: integer
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 */
// Daftar percakapan (pesan terakhir per lawan bicara + jumlah belum dibaca)
export const GET = route(async ({ user }) => {
  const { rows } = await query(
    `SELECT * FROM (
       SELECT DISTINCT ON (x.lawan_id) x.lawan_id, u.nama AS lawan_nama, x.isi_pesan, x.sent_at,
              (SELECT COUNT(*)::int FROM pesan m
                WHERE m.pengirim_id = x.lawan_id AND m.penerima_id = $1 AND NOT m.is_read) AS belum_dibaca
       FROM (SELECT CASE WHEN p.pengirim_id = $1 THEN p.penerima_id ELSE p.pengirim_id END AS lawan_id, p.*
             FROM pesan p WHERE p.pengirim_id = $1 OR p.penerima_id = $1) x
       JOIN pengguna u ON u.pengguna_id = x.lawan_id
       ORDER BY x.lawan_id, x.sent_at DESC, x.pesan_id DESC
     ) t ORDER BY sent_at DESC`,
    [user.pengguna_id]
  );
  return ok(rows);
}, { auth: true });

/**
 * @swagger
 * /api/pesan:
 *   post:
 *     summary: Kirim pesan
 *     tags:
 *     - Pesan
 *     description: Penerima mendapat notifikasi. Perlu akun yang sudah diverifikasi admin.
 *     security:
 *     - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *             - penerima_id
 *             - isi_pesan
 *             properties:
 *               penerima_id:
 *                 type: integer
 *                 minimum: 1
 *               isi_pesan:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 5000
 *     responses:
 *       '201':
 *         description: Pesan terkirim
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Pesan'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 */
// Kirim pesan (+ notifikasi ke penerima)
export const POST = route(async ({ req, user }) => {
  const d = await body(req, schema);
  if (d.penerima_id === user.pengguna_id) throw new ApiError(400, 'Tidak bisa mengirim pesan ke diri sendiri');
  const msg = await tx(async (c) => {
    const { rowCount } = await c.query('SELECT 1 FROM pengguna WHERE pengguna_id = $1', [d.penerima_id]);
    if (!rowCount) throw new ApiError(404, 'Penerima tidak ditemukan');
    const { rows } = await c.query(
      'INSERT INTO pesan (pengirim_id, penerima_id, isi_pesan) VALUES ($1,$2,$3) RETURNING *',
      [user.pengguna_id, d.penerima_id, d.isi_pesan]
    );
    await c.query(`INSERT INTO notifikasi (pengguna_id, tipe, isi) VALUES ($1,'pesan',$2)`,
      [d.penerima_id, `Pesan baru dari ${user.nama}`]);
    return rows[0];
  });
  return ok(msg, 201);
}, { verified: true });

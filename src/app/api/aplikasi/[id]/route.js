import { z } from 'zod';
import { query, tx } from '@/lib/db';
import { route, ok, body, intParam, ApiError } from '@/lib/api';

/**
 * @swagger
 * /api/aplikasi/{id}:
 *   patch:
 *     summary: Terima / tolak pelamar
 *     tags:
 *     - Aplikasi
 *     description: Hanya pemilik proyek. Jika slot terakhir terisi, proyek otomatis ditutup dan pelamar mendapat notifikasi. Perlu akun yang sudah diverifikasi admin.
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *     - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *             - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                 - diterima
 *                 - ditolak
 *     responses:
 *       '200':
 *         description: Berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Aplikasi'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '409':
 *         $ref: '#/components/responses/Conflict'
 */
// Seleksi/persetujuan pelamar oleh pemilik proyek
export const PATCH = route(async ({ req, user, params }) => {
  const id = intParam(params.id);
  const { status } = await body(req, z.object({ status: z.enum(['diterima', 'ditolak']) }));
  const result = await tx(async (c) => {
    const { rows } = await c.query(
      `SELECT a.status, a.pelamar_id, a.proyek_id, pr.pemilik_id, pr.slot_dibutuhkan, pr.judul
       FROM aplikasi a JOIN proyek pr ON pr.proyek_id = a.proyek_id
       WHERE a.aplikasi_id = $1 FOR UPDATE OF a, pr`, [id]);
    const a = rows[0];
    if (!a) throw new ApiError(404, 'Lamaran tidak ditemukan');
    if (a.pemilik_id !== user.pengguna_id) throw new ApiError(403, 'Anda bukan pemilik proyek ini');
    if (a.status !== 'pending') throw new ApiError(409, 'Lamaran sudah diproses');

    if (status === 'diterima') {
      const { rows: [{ n }] } = await c.query(
        `SELECT COUNT(*)::int AS n FROM aplikasi WHERE proyek_id = $1 AND status = 'diterima'`, [a.proyek_id]);
      if (n >= a.slot_dibutuhkan) throw new ApiError(409, 'Slot proyek sudah penuh');
      // Slot terakhir terisi -> proyek otomatis ditutup
      if (n + 1 >= a.slot_dibutuhkan)
        await c.query(`UPDATE proyek SET status = 'ditutup' WHERE proyek_id = $1 AND status = 'buka'`, [a.proyek_id]);
    }
    const upd = await c.query('UPDATE aplikasi SET status = $1 WHERE aplikasi_id = $2 RETURNING *', [status, id]);
    await c.query(`INSERT INTO notifikasi (pengguna_id, tipe, isi) VALUES ($1,'status_lamaran',$2)`,
      [a.pelamar_id, `Lamaran Anda pada proyek "${a.judul}" ${status}`]);
    return upd.rows[0];
  });
  return ok(result);
}, { verified: true });

/**
 * @swagger
 * /api/aplikasi/{id}:
 *   delete:
 *     summary: Batalkan lamaran sendiri
 *     tags:
 *     - Aplikasi
 *     description: Hanya bisa jika lamaran masih pending.
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
 *                   type: object
 *                   properties:
 *                     deleted:
 *                       type: boolean
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 */
// Batalkan lamaran sendiri (hanya jika masih pending)
export const DELETE = route(async ({ user, params }) => {
  const { rowCount } = await query(
    `DELETE FROM aplikasi WHERE aplikasi_id = $1 AND pelamar_id = $2 AND status = 'pending'`,
    [intParam(params.id), user.pengguna_id]
  );
  if (!rowCount) throw new ApiError(404, 'Lamaran tidak ditemukan atau sudah diproses');
  return ok({ deleted: true });
}, { auth: true });

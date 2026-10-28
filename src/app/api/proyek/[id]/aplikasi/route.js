import { z } from 'zod';
import { query, tx } from '@/lib/db';
import { route, ok, body, intParam, ApiError } from '@/lib/api';

/**
 * @swagger
 * /api/proyek/{id}/aplikasi:
 *   post:
 *     summary: Ajukan bergabung ke proyek
 *     tags:
 *     - Aplikasi
 *     description: Pemilik proyek mendapat notifikasi. Tidak bisa melamar proyek sendiri atau proyek yang sudah ditutup. Perlu akun yang sudah diverifikasi admin.
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
 *               pesan:
 *                 type: string
 *                 maxLength: 2000
 *     responses:
 *       '201':
 *         description: Lamaran dikirim
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
// Pengajuan bergabung (+ notifikasi ke pemilik proyek)
export const POST = route(async ({ req, user, params }) => {
  const id = intParam(params.id);
  const { pesan } = await body(req, z.object({ pesan: z.string().max(2000).optional() }));
  const result = await tx(async (c) => {
    const { rows } = await c.query(
      `SELECT pemilik_id, judul, status, deadline,
              (deadline IS NOT NULL AND deadline < CURRENT_DATE) AS lewat
       FROM proyek WHERE proyek_id = $1`, [id]);
    const p = rows[0];
    if (!p) throw new ApiError(404, 'Proyek tidak ditemukan');
    if (p.pemilik_id === user.pengguna_id) throw new ApiError(400, 'Tidak bisa melamar ke proyek sendiri');
    if (p.status !== 'buka' || p.lewat) throw new ApiError(409, 'Proyek sudah ditutup');
    const ins = await c.query(
      'INSERT INTO aplikasi (proyek_id, pelamar_id, pesan) VALUES ($1,$2,$3) RETURNING *',
      [id, user.pengguna_id, pesan ?? null]
    );
    await c.query(`INSERT INTO notifikasi (pengguna_id, tipe, isi) VALUES ($1,'pelamar',$2)`,
      [p.pemilik_id, `${user.nama} mengajukan bergabung ke proyek "${p.judul}"`]);
    return ins.rows[0];
  });
  return ok(result, 201);
}, { verified: true });

/**
 * @swagger
 * /api/proyek/{id}/aplikasi:
 *   get:
 *     summary: Daftar pelamar proyek
 *     tags:
 *     - Aplikasi
 *     description: Hanya pemilik proyek.
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *     - $ref: '#/components/parameters/Id'
 *     - in: query
 *       name: status
 *       schema:
 *         type: string
 *         enum:
 *         - pending
 *         - diterima
 *         - ditolak
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
 *                       aplikasi_id:
 *                         type: integer
 *                       status:
 *                         type: string
 *                       pesan:
 *                         type: string
 *                       applied_at:
 *                         type: string
 *                         format: date-time
 *                       pengguna_id:
 *                         type: integer
 *                       nama:
 *                         type: string
 *                       jurusan:
 *                         type: string
 *                       angkatan:
 *                         type: integer
 *                       ketersediaan_waktu:
 *                         type: string
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 */
// Pemilik proyek melihat daftar pelamar. ?status=pending|diterima|ditolak
export const GET = route(async ({ req, user, params }) => {
  const id = intParam(params.id);
  const { rows: pr } = await query('SELECT pemilik_id FROM proyek WHERE proyek_id = $1', [id]);
  if (!pr[0]) throw new ApiError(404, 'Proyek tidak ditemukan');
  if (pr[0].pemilik_id !== user.pengguna_id) throw new ApiError(403, 'Anda bukan pemilik proyek ini');
  const status = new URL(req.url).searchParams.get('status');
  const { rows } = await query(
    `SELECT a.aplikasi_id, a.status, a.pesan, a.applied_at,
            u.pengguna_id, u.nama, u.jurusan, u.angkatan, u.ketersediaan_waktu
     FROM aplikasi a JOIN pengguna u ON u.pengguna_id = a.pelamar_id
     WHERE a.proyek_id = $1 AND ($2::text IS NULL OR a.status = $2)
     ORDER BY a.applied_at DESC`,
    [id, status]
  );
  return ok(rows);
}, { auth: true });

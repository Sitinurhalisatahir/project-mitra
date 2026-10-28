import { z } from 'zod';
import { query, tx } from '@/lib/db';
import { route, ok, body, intParam, ApiError } from '@/lib/api';
import { updateRow } from '@/lib/sql';
import { tagsProyek, slotTerisi } from '@/lib/queries';
import { proyekBase } from '@/lib/schemas';

const updateSchema = proyekBase.partial().extend({ status: z.enum(['buka', 'ditutup', 'selesai']).optional() });

/**
 * @swagger
 * /api/proyek/{id}:
 *   get:
 *     summary: Detail proyek
 *     tags:
 *     - Proyek
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
 *                   allOf:
 *                   - $ref: '#/components/schemas/Proyek'
 *                   - type: object
 *                     properties:
 *                       anggota:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             pengguna_id:
 *                               type: integer
 *                             nama:
 *                               type: string
 *                             jurusan:
 *                               type: string
 *                       lamaran_saya:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           aplikasi_id:
 *                             type: integer
 *                           status:
 *                             type: string
 *                       is_pemilik:
 *                         type: boolean
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 */
export const GET = route(async ({ user, params }) => {
  const id = intParam(params.id);
  const { rows } = await query(
    `SELECT pr.*, u.nama AS pemilik_nama, u.jurusan AS pemilik_jurusan,
            ${slotTerisi('pr.proyek_id')} AS slot_terisi, ${tagsProyek('pr.proyek_id')} AS tags
     FROM proyek pr JOIN pengguna u ON u.pengguna_id = pr.pemilik_id WHERE pr.proyek_id = $1`,
    [id]
  );
  if (!rows[0]) throw new ApiError(404, 'Proyek tidak ditemukan');
  const [anggota, saya] = await Promise.all([
    query(
      `SELECT u.pengguna_id, u.nama, u.jurusan FROM aplikasi a
       JOIN pengguna u ON u.pengguna_id = a.pelamar_id WHERE a.proyek_id = $1 AND a.status = 'diterima'`,
      [id]
    ),
    query('SELECT aplikasi_id, status FROM aplikasi WHERE proyek_id = $1 AND pelamar_id = $2', [id, user.pengguna_id]),
  ]);
  return ok({
    ...rows[0],
    anggota: anggota.rows,
    lamaran_saya: saya.rows[0] ?? null,
    is_pemilik: rows[0].pemilik_id === user.pengguna_id,
  });
}, { auth: true });

async function assertOwner(id, user, allowAdmin = false) {
  const { rows } = await query('SELECT pemilik_id FROM proyek WHERE proyek_id = $1', [id]);
  if (!rows[0]) throw new ApiError(404, 'Proyek tidak ditemukan');
  if (rows[0].pemilik_id !== user.pengguna_id && !(allowAdmin && user.role === 'admin'))
    throw new ApiError(403, 'Anda bukan pemilik proyek ini');
}

/**
 * @swagger
 * /api/proyek/{id}:
 *   put:
 *     summary: Ubah proyek
 *     tags:
 *     - Proyek
 *     description: Hanya pemilik. Jika tag_ids dikirim, seluruh tag lama diganti. Perlu akun yang sudah diverifikasi admin.
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *     - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProyekUpdate'
 *     responses:
 *       '200':
 *         description: Berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Proyek'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 */
export const PUT = route(async ({ req, user, params }) => {
  const id = intParam(params.id);
  await assertOwner(id, user);
  const { tag_ids, ...fields } = await body(req, updateSchema);
  const result = await tx(async (c) => {
    const row = (await updateRow(c, 'proyek', 'proyek_id', id, fields)) ??
      (await c.query('SELECT * FROM proyek WHERE proyek_id = $1', [id])).rows[0];
    if (tag_ids) {
      await c.query('DELETE FROM proyek_tag WHERE proyek_id = $1', [id]);
      if (tag_ids.length)
        await c.query('INSERT INTO proyek_tag (proyek_id, tag_id) SELECT $1, unnest($2::int[])', [id, tag_ids]);
    }
    return row;
  });
  return ok(result);
}, { verified: true });

/**
 * @swagger
 * /api/proyek/{id}:
 *   delete:
 *     summary: Hapus proyek
 *     tags:
 *     - Proyek
 *     description: Pemilik proyek atau admin.
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
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 */
export const DELETE = route(async ({ user, params }) => {
  const id = intParam(params.id);
  await assertOwner(id, user, true);
  await query('DELETE FROM proyek WHERE proyek_id = $1', [id]);
  return ok({ deleted: true });
}, { auth: true });

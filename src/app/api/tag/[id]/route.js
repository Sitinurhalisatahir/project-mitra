import { z } from 'zod';
import { pool, query } from '@/lib/db';
import { route, ok, body, intParam, ApiError } from '@/lib/api';
import { updateRow } from '@/lib/sql';

const schema = z.object({
  nama_tag: z.string().min(1).max(100),
  jenis: z.enum(['skill', 'minat']),
  kategori: z.string().max(50),
}).partial();

/**
 * @swagger
 * /api/tag/{id}:
 *   put:
 *     summary: Ubah tag
 *     tags:
 *     - Tag
 *     description: Khusus admin.
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *     - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TagUpdate'
 *     responses:
 *       '200':
 *         description: Berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Tag'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 */
export const PUT = route(async ({ req, params }) => {
  const row = await updateRow(pool, 'tag', 'tag_id', intParam(params.id), await body(req, schema));
  if (!row) throw new ApiError(404, 'Tag tidak ditemukan / tidak ada perubahan');
  return ok(row);
}, { admin: true });

/**
 * @swagger
 * /api/tag/{id}:
 *   delete:
 *     summary: Hapus tag
 *     tags:
 *     - Tag
 *     description: Khusus admin.
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
export const DELETE = route(async ({ params }) => {
  const { rowCount } = await query('DELETE FROM tag WHERE tag_id = $1', [intParam(params.id)]);
  if (!rowCount) throw new ApiError(404, 'Tag tidak ditemukan');
  return ok({ deleted: true });
}, { admin: true });

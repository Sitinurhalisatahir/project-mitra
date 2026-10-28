import { z } from 'zod';
import { query } from '@/lib/db';
import { route, ok, body } from '@/lib/api';
import { filters } from '@/lib/sql';

const tagSchema = z.object({
  nama_tag: z.string().min(1).max(100),
  jenis: z.enum(['skill', 'minat']),
  kategori: z.string().max(50).optional(),
});

/**
 * @swagger
 * /api/tag:
 *   get:
 *     summary: Daftar tag skill/minat
 *     tags:
 *     - Tag
 *     description: Publik, untuk dropdown.
 *     security: []
 *     parameters:
 *     - in: query
 *       name: jenis
 *       schema:
 *         type: string
 *         enum:
 *         - skill
 *         - minat
 *     - in: query
 *       name: kategori
 *       schema:
 *         type: string
 *     - in: query
 *       name: q
 *       schema:
 *         type: string
 *       description: Cari nama tag
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
 *                     $ref: '#/components/schemas/Tag'
 */
// Publik: daftar tag untuk dropdown. ?jenis=skill|minat&kategori=&q=
export const GET = route(async ({ req }) => {
  const sp = new URL(req.url).searchParams;
  const f = filters();
  if (sp.get('jenis')) f.add('jenis = ?', sp.get('jenis'));
  if (sp.get('kategori')) f.add('kategori = ?', sp.get('kategori'));
  if (sp.get('q')) f.add('nama_tag ILIKE ?', `%${sp.get('q')}%`);
  const { rows } = await query(`SELECT * FROM tag ${f.where()} ORDER BY jenis, nama_tag`, f.v);
  return ok(rows);
});

/**
 * @swagger
 * /api/tag:
 *   post:
 *     summary: Tambah tag
 *     tags:
 *     - Tag
 *     description: Khusus admin.
 *     security:
 *     - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TagInput'
 *     responses:
 *       '201':
 *         description: Tag dibuat
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
 */
// Admin: kelola kategori skill/minat
export const POST = route(async ({ req }) => {
  const d = await body(req, tagSchema);
  const { rows } = await query(
    'INSERT INTO tag (nama_tag, jenis, kategori) VALUES ($1,$2,$3) RETURNING *',
    [d.nama_tag, d.jenis, d.kategori ?? null]
  );
  return ok(rows[0], 201);
}, { admin: true });

import { query, tx } from '@/lib/db';
import { route, ok, body, intList } from '@/lib/api';
import { filters, paging, paged } from '@/lib/sql';
import { tagsProyek, slotTerisi } from '@/lib/queries';
import { proyekBase } from '@/lib/schemas';

/**
 * @swagger
 * /api/proyek:
 *   get:
 *     summary: Cari dan filter proyek
 *     tags:
 *     - Proyek
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *     - in: query
 *       name: q
 *       schema:
 *         type: string
 *       description: Cari judul atau deskripsi
 *     - in: query
 *       name: kategori
 *       schema:
 *         type: string
 *     - in: query
 *       name: status
 *       schema:
 *         type: string
 *         enum:
 *         - buka
 *         - ditutup
 *         - selesai
 *         - all
 *         default: buka
 *     - in: query
 *       name: tag_id
 *       schema:
 *         type: string
 *       description: Daftar tag_id dipisah koma, contoh 1,2
 *     - in: query
 *       name: pemilik_id
 *       schema:
 *         type: integer
 *     - in: query
 *       name: mine
 *       schema:
 *         type: boolean
 *       description: true = hanya proyek saya
 *     - in: query
 *       name: sort
 *       schema:
 *         type: string
 *         enum:
 *         - terbaru
 *         - deadline
 *         default: terbaru
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
 *                     $ref: '#/components/schemas/Proyek'
 *                 meta:
 *                   $ref: '#/components/schemas/Meta'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 */
// Pencarian & filter proyek:
// ?q=&kategori=&status=buka|ditutup|selesai|all&tag_id=1,2&pemilik_id=&mine=true&sort=terbaru|deadline
export const GET = route(async ({ req, user }) => {
  const sp = new URL(req.url).searchParams;
  const pg = paging(sp);
  const f = filters();
  const status = sp.get('status') || 'buka';
  if (status !== 'all') f.add('pr.status = ?', status);
  if (sp.get('q')) f.add('(pr.judul ILIKE ? OR pr.deskripsi ILIKE ?)', `%${sp.get('q')}%`);
  if (sp.get('kategori')) f.add('pr.kategori = ?', sp.get('kategori'));
  if (sp.get('mine') === 'true') f.add('pr.pemilik_id = ?', user.pengguna_id);
  else if (sp.get('pemilik_id')) f.add('pr.pemilik_id = ?', parseInt(sp.get('pemilik_id')));
  const tagIds = intList(sp.get('tag_id'));
  if (tagIds.length)
    f.add(`EXISTS (SELECT 1 FROM proyek_tag x WHERE x.proyek_id = pr.proyek_id AND x.tag_id = ANY(?::int[]))`, tagIds);
  const order = sp.get('sort') === 'deadline' ? 'pr.deadline ASC NULLS LAST' : 'pr.created_at DESC';

  const { rows } = await query(
    `SELECT pr.proyek_id, pr.pemilik_id, u.nama AS pemilik_nama, pr.judul, pr.deskripsi, pr.kategori,
            pr.slot_dibutuhkan, ${slotTerisi('pr.proyek_id')} AS slot_terisi, pr.deadline, pr.status, pr.created_at,
            ${tagsProyek('pr.proyek_id')} AS tags, COUNT(*) OVER()::int AS total
     FROM proyek pr JOIN pengguna u ON u.pengguna_id = pr.pemilik_id
     ${f.where()} ORDER BY ${order} LIMIT $${f.v.length + 1} OFFSET $${f.v.length + 2}`,
    [...f.v, pg.limit, pg.offset]
  );
  const { items, meta } = paged(rows, pg);
  return ok(items, 200, meta);
}, { auth: true });

/**
 * @swagger
 * /api/proyek:
 *   post:
 *     summary: Buat proyek
 *     tags:
 *     - Proyek
 *     description: Mahasiswa terverifikasi dengan tag yang cocok mendapat notifikasi rekomendasi. Perlu akun yang sudah diverifikasi admin.
 *     security:
 *     - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProyekInput'
 *     responses:
 *       '201':
 *         description: Proyek dibuat
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
 */
// Pembuatan proyek + notifikasi rekomendasi ke mahasiswa dengan tag yang cocok
export const POST = route(async ({ req, user }) => {
  const d = await body(req, proyekBase);
  const proyek = await tx(async (c) => {
    const { rows } = await c.query(
      `INSERT INTO proyek (pemilik_id, judul, deskripsi, kategori, slot_dibutuhkan, deadline)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [user.pengguna_id, d.judul, d.deskripsi ?? null, d.kategori ?? null, d.slot_dibutuhkan ?? 1, d.deadline ?? null]
    );
    const p = rows[0];
    if (d.tag_ids?.length) {
      await c.query(
        'INSERT INTO proyek_tag (proyek_id, tag_id) SELECT $1, unnest($2::int[]) ON CONFLICT DO NOTHING',
        [p.proyek_id, d.tag_ids]
      );
      await c.query(
        `INSERT INTO notifikasi (pengguna_id, tipe, isi)
         SELECT DISTINCT pt.pengguna_id, 'rekomendasi', $2
         FROM proyek_tag prt
         JOIN pengguna_tag pt ON pt.tag_id = prt.tag_id
         JOIN pengguna u ON u.pengguna_id = pt.pengguna_id
         WHERE prt.proyek_id = $1 AND pt.pengguna_id <> $3 AND u.is_verified`,
        [p.proyek_id, `Proyek baru yang cocok dengan skill/minatmu: ${p.judul}`, user.pengguna_id]
      );
    }
    return p;
  });
  return ok(proyek, 201);
}, { verified: true });

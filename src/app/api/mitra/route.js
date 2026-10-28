import { query } from '@/lib/db';
import { route, ok, intList } from '@/lib/api';
import { filters, paging, paged } from '@/lib/sql';
import { tagsPengguna } from '@/lib/queries';

/**
 * @swagger
 * /api/mitra:
 *   get:
 *     summary: Cari dan filter mitra
 *     tags:
 *     - Mitra
 *     description: Hanya mahasiswa terverifikasi dengan profil publik, tidak termasuk diri sendiri.
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *     - in: query
 *       name: q
 *       schema:
 *         type: string
 *       description: Cari nama
 *     - in: query
 *       name: jurusan
 *       schema:
 *         type: string
 *     - in: query
 *       name: angkatan
 *       schema:
 *         type: integer
 *     - in: query
 *       name: tag_id
 *       schema:
 *         type: string
 *       description: Daftar tag_id dipisah koma, contoh 1,2
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
 *                     type: object
 *                     properties:
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
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: object
 *                           additionalProperties: true
 *                 meta:
 *                   $ref: '#/components/schemas/Meta'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 */
// Pencarian & filter mitra: ?q=&jurusan=&angkatan=&tag_id=1,2&page=&limit=
export const GET = route(async ({ req, user }) => {
  const sp = new URL(req.url).searchParams;
  const pg = paging(sp);
  const f = filters();
  f.raw(`p.role = 'mahasiswa' AND p.is_verified AND p.profil_publik`);
  f.add('p.pengguna_id <> ?', user.pengguna_id);
  if (sp.get('q')) f.add('p.nama ILIKE ?', `%${sp.get('q')}%`);
  if (sp.get('jurusan')) f.add('p.jurusan ILIKE ?', `%${sp.get('jurusan')}%`);
  if (sp.get('angkatan')) f.add('p.angkatan = ?', parseInt(sp.get('angkatan')));
  const tagIds = intList(sp.get('tag_id'));
  if (tagIds.length)
    f.add(`EXISTS (SELECT 1 FROM pengguna_tag x WHERE x.pengguna_id = p.pengguna_id AND x.tag_id = ANY(?::int[]))`, tagIds);

  const { rows } = await query(
    `SELECT p.pengguna_id, p.nama, p.jurusan, p.angkatan, p.ketersediaan_waktu,
            ${tagsPengguna('p.pengguna_id')} AS tags, COUNT(*) OVER()::int AS total
     FROM pengguna p ${f.where()}
     ORDER BY p.nama LIMIT $${f.v.length + 1} OFFSET $${f.v.length + 2}`,
    [...f.v, pg.limit, pg.offset]
  );
  const { items, meta } = paged(rows, pg);
  return ok(items, 200, meta);
}, { auth: true });

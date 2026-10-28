import { query } from '@/lib/db';
import { route, ok } from '@/lib/api';
import { filters, paging, paged } from '@/lib/sql';

/**
 * @swagger
 * /api/admin/pengguna:
 *   get:
 *     summary: Daftar akun untuk diverifikasi
 *     tags:
 *     - Admin
 *     description: Khusus admin.
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *     - in: query
 *       name: is_verified
 *       schema:
 *         type: boolean
 *       description: Filter status verifikasi
 *     - in: query
 *       name: q
 *       schema:
 *         type: string
 *       description: Cari nama, NIM, atau email
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
 *                     $ref: '#/components/schemas/PenggunaAdmin'
 *                 meta:
 *                   $ref: '#/components/schemas/Meta'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 */
// Daftar akun untuk diverifikasi: ?is_verified=false&q=
export const GET = route(async ({ req }) => {
  const sp = new URL(req.url).searchParams;
  const pg = paging(sp);
  const f = filters();
  if (sp.get('is_verified')) f.add('is_verified = ?', sp.get('is_verified') === 'true');
  if (sp.get('q')) f.add('(nama ILIKE ? OR nim ILIKE ? OR email ILIKE ?)', `%${sp.get('q')}%`);
  const { rows } = await query(
    `SELECT pengguna_id, nim, nama, email, jurusan, angkatan, role, is_verified, created_at,
            COUNT(*) OVER()::int AS total
     FROM pengguna ${f.where()} ORDER BY created_at DESC LIMIT $${f.v.length + 1} OFFSET $${f.v.length + 2}`,
    [...f.v, pg.limit, pg.offset]
  );
  const { items, meta } = paged(rows, pg);
  return ok(items, 200, meta);
}, { admin: true });

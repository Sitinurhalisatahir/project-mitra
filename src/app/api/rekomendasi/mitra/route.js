import { query } from '@/lib/db';
import { route, ok, intParam, ApiError } from '@/lib/api';
import { tagsPengguna } from '@/lib/queries';

/**
 * @swagger
 * /api/rekomendasi/mitra:
 *   get:
 *     summary: Rekomendasi mitra untuk proyek saya
 *     tags:
 *     - Rekomendasi
 *     description: Hanya pemilik proyek.
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *     - in: query
 *       name: proyek_id
 *       schema:
 *         type: integer
 *       required: true
 *     - in: query
 *       name: limit
 *       schema:
 *         type: integer
 *         default: 10
 *         maximum: 50
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
 *                       skor:
 *                         type: integer
 *                         description: Jumlah tag yang sama dengan proyek
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 */
// Rekomendasi mitra untuk proyek saya: GET ?proyek_id=1
export const GET = route(async ({ req, user }) => {
  const sp = new URL(req.url).searchParams;
  const proyekId = intParam(sp.get('proyek_id'), 'proyek_id');
  const limit = Math.min(50, parseInt(sp.get('limit')) || 10);
  const { rows: pr } = await query('SELECT pemilik_id FROM proyek WHERE proyek_id = $1', [proyekId]);
  if (!pr[0]) throw new ApiError(404, 'Proyek tidak ditemukan');
  if (pr[0].pemilik_id !== user.pengguna_id) throw new ApiError(403, 'Anda bukan pemilik proyek ini');
  const { rows } = await query(
    `SELECT u.pengguna_id, u.nama, u.jurusan, u.angkatan, u.ketersediaan_waktu,
            ${tagsPengguna('u.pengguna_id')} AS tags, COUNT(*)::int AS skor
     FROM proyek_tag prt
     JOIN pengguna_tag pt ON pt.tag_id = prt.tag_id
     JOIN pengguna u ON u.pengguna_id = pt.pengguna_id
     WHERE prt.proyek_id = $1 AND u.is_verified AND u.profil_publik AND u.pengguna_id <> $2
     GROUP BY u.pengguna_id ORDER BY skor DESC LIMIT $3`,
    [proyekId, user.pengguna_id, limit]
  );
  return ok(rows);
}, { auth: true });

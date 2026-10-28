import { query } from '@/lib/db';
import { route, ok } from '@/lib/api';
import { tagsProyek } from '@/lib/queries';

/**
 * @swagger
 * /api/rekomendasi/proyek:
 *   get:
 *     summary: Rekomendasi proyek untuk saya
 *     tags:
 *     - Rekomendasi
 *     description: Berdasarkan jumlah tag skill/minat yang sama dengan profil saya.
 *     security:
 *     - bearerAuth: []
 *     parameters:
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
 *                       proyek_id:
 *                         type: integer
 *                       judul:
 *                         type: string
 *                       kategori:
 *                         type: string
 *                       deadline:
 *                         type: string
 *                         format: date
 *                         nullable: true
 *                       slot_dibutuhkan:
 *                         type: integer
 *                       pemilik_nama:
 *                         type: string
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: object
 *                           additionalProperties: true
 *                       skor:
 *                         type: integer
 *                         description: Jumlah tag yang sama dengan profil saya
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 */
// Rekomendasi proyek berdasarkan jumlah tag (skill/minat) yang sama dengan profil saya
export const GET = route(async ({ req, user }) => {
  const limit = Math.min(50, parseInt(new URL(req.url).searchParams.get('limit')) || 10);
  const { rows } = await query(
    `SELECT pr.proyek_id, pr.judul, pr.kategori, pr.deadline, pr.slot_dibutuhkan, u.nama AS pemilik_nama,
            ${tagsProyek('pr.proyek_id')} AS tags, COUNT(*)::int AS skor
     FROM proyek pr
     JOIN proyek_tag prt ON prt.proyek_id = pr.proyek_id
     JOIN pengguna_tag pt ON pt.tag_id = prt.tag_id AND pt.pengguna_id = $1
     JOIN pengguna u ON u.pengguna_id = pr.pemilik_id
     WHERE pr.status = 'buka' AND pr.pemilik_id <> $1
       AND (pr.deadline IS NULL OR pr.deadline >= CURRENT_DATE)
       AND NOT EXISTS (SELECT 1 FROM aplikasi a WHERE a.proyek_id = pr.proyek_id AND a.pelamar_id = $1)
     GROUP BY pr.proyek_id, u.pengguna_id
     ORDER BY skor DESC, pr.created_at DESC LIMIT $2`,
    [user.pengguna_id, limit]
  );
  return ok(rows);
}, { auth: true });

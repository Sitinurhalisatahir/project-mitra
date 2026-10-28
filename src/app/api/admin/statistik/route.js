import { query } from '@/lib/db';
import { route, ok } from '@/lib/api';

const grup = (tbl) =>
  `(SELECT COALESCE(json_object_agg(status, c), '{}'::json) FROM (SELECT status, COUNT(*)::int c FROM ${tbl} GROUP BY status) s)`;

/**
 * @swagger
 * /api/admin/statistik:
 *   get:
 *     summary: Statistik penggunaan aplikasi
 *     tags:
 *     - Admin
 *     description: Khusus admin.
 *     security:
 *     - bearerAuth: []
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
 *                     total_mahasiswa:
 *                       type: integer
 *                     terverifikasi:
 *                       type: integer
 *                     menunggu_verifikasi:
 *                       type: integer
 *                     pengguna_baru_7_hari:
 *                       type: integer
 *                     proyek_per_status:
 *                       type: object
 *                       additionalProperties:
 *                         type: integer
 *                     proyek_per_kategori:
 *                       type: object
 *                       additionalProperties:
 *                         type: integer
 *                     lamaran_per_status:
 *                       type: object
 *                       additionalProperties:
 *                         type: integer
 *                     total_pesan:
 *                       type: integer
 *                     tag_terpopuler:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           nama_tag:
 *                             type: string
 *                           jenis:
 *                             type: string
 *                           jumlah_pengguna:
 *                             type: integer
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 */
// Pantau statistik penggunaan
export const GET = route(async () => {
  const { rows } = await query(`
    SELECT
      (SELECT COUNT(*)::int FROM pengguna WHERE role = 'mahasiswa') AS total_mahasiswa,
      (SELECT COUNT(*)::int FROM pengguna WHERE role = 'mahasiswa' AND is_verified) AS terverifikasi,
      (SELECT COUNT(*)::int FROM pengguna WHERE role = 'mahasiswa' AND NOT is_verified) AS menunggu_verifikasi,
      (SELECT COUNT(*)::int FROM pengguna WHERE created_at >= NOW() - INTERVAL '7 days') AS pengguna_baru_7_hari,
      ${grup('proyek')} AS proyek_per_status,
      (SELECT COALESCE(json_object_agg(COALESCE(kategori,'lainnya'), c), '{}'::json)
         FROM (SELECT kategori, COUNT(*)::int c FROM proyek GROUP BY kategori) k) AS proyek_per_kategori,
      ${grup('aplikasi')} AS lamaran_per_status,
      (SELECT COUNT(*)::int FROM pesan) AS total_pesan,
      (SELECT COALESCE(json_agg(t), '[]'::json) FROM (
         SELECT tg.nama_tag, tg.jenis, COUNT(*)::int AS jumlah_pengguna
         FROM pengguna_tag pt JOIN tag tg ON tg.tag_id = pt.tag_id
         GROUP BY tg.tag_id ORDER BY jumlah_pengguna DESC LIMIT 10) t) AS tag_terpopuler
  `);
  return ok(rows[0]);
}, { admin: true });

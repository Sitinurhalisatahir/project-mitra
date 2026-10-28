import { query } from '@/lib/db';
import { route, ok } from '@/lib/api';

/**
 * @swagger
 * /api/aplikasi:
 *   get:
 *     summary: Lamaran milik saya
 *     tags:
 *     - Aplikasi
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       aplikasi_id:
 *                         type: integer
 *                       status:
 *                         type: string
 *                         enum:
 *                         - pending
 *                         - diterima
 *                         - ditolak
 *                       pesan:
 *                         type: string
 *                       applied_at:
 *                         type: string
 *                         format: date-time
 *                       proyek_id:
 *                         type: integer
 *                       judul:
 *                         type: string
 *                       status_proyek:
 *                         type: string
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 */
// Lamaran milik saya
export const GET = route(async ({ user }) => {
  const { rows } = await query(
    `SELECT a.aplikasi_id, a.status, a.pesan, a.applied_at, pr.proyek_id, pr.judul, pr.status AS status_proyek
     FROM aplikasi a JOIN proyek pr ON pr.proyek_id = a.proyek_id
     WHERE a.pelamar_id = $1 ORDER BY a.applied_at DESC`,
    [user.pengguna_id]
  );
  return ok(rows);
}, { auth: true });

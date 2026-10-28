import { route, ok, intParam, ApiError } from '@/lib/api';
import { getProfilLengkap } from '@/lib/queries';

/**
 * @swagger
 * /api/pengguna/{id}:
 *   get:
 *     summary: Profil publik pengguna lain
 *     tags:
 *     - Pengguna
 *     description: Email dan NIM disembunyikan kecuali melihat profil sendiri atau sebagai admin. Profil privat mengembalikan 403.
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
 *                   $ref: '#/components/schemas/ProfilLengkap'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 */
// Profil publik mahasiswa lain (email & NIM disembunyikan)
export const GET = route(async ({ user, params }) => {
  const id = intParam(params.id);
  const p = await getProfilLengkap(id);
  if (!p) throw new ApiError(404, 'Pengguna tidak ditemukan');
  const self = id === user.pengguna_id || user.role === 'admin';
  if (!p.profil_publik && !self) throw new ApiError(403, 'Profil ini bersifat privat');
  if (!self) {
    delete p.email;
    delete p.nim;
  }
  return ok(p);
}, { auth: true });

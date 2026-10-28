import { route, ok } from '@/lib/api';
import { getProfilLengkap } from '@/lib/queries';

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Profil lengkap pengguna yang sedang login
 *     tags:
 *     - Auth
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
 *                   $ref: '#/components/schemas/ProfilLengkap'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 */
export const GET = route(async ({ user }) => ok(await getProfilLengkap(user.pengguna_id)), { auth: true });

import { z } from 'zod';
import { tx } from '@/lib/db';
import { route, ok, body } from '@/lib/api';
import { updateRow } from '@/lib/sql';
import { getProfilLengkap } from '@/lib/queries';

const schema = z
  .object({
    nama: z.string().min(1).max(100),
    jurusan: z.string().max(100),
    angkatan: z.number().int(),
    ketersediaan_waktu: z.string().max(100),
    profil_publik: z.boolean(),
    // skill & minat; jika dikirim, menggantikan seluruh tag lama
    tags: z.array(z.object({
      tag_id: z.number().int().positive(),
      level: z.enum(['pemula', 'menengah', 'mahir']).optional(),
    })),
  })
  .partial();

/**
 * @swagger
 * /api/profil:
 *   get:
 *     summary: Profil saya
 *     tags:
 *     - Profil
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

/**
 * @swagger
 * /api/profil:
 *   put:
 *     summary: Ubah profil saya
 *     tags:
 *     - Profil
 *     description: Semua field opsional. Jika tags dikirim, seluruh tag lama diganti.
 *     security:
 *     - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfilInput'
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
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 */
// Pembuatan & pengelolaan profil
export const PUT = route(async ({ req, user }) => {
  const { tags, ...fields } = await body(req, schema);
  await tx(async (c) => {
    await updateRow(c, 'pengguna', 'pengguna_id', user.pengguna_id, fields);
    if (tags) {
      await c.query('DELETE FROM pengguna_tag WHERE pengguna_id = $1', [user.pengguna_id]);
      for (const t of tags)
        await c.query(
          `INSERT INTO pengguna_tag (pengguna_id, tag_id, level) VALUES ($1,$2,$3)
           ON CONFLICT (pengguna_id, tag_id) DO UPDATE SET level = EXCLUDED.level`,
          [user.pengguna_id, t.tag_id, t.level ?? null]
        );
    }
  });
  return ok(await getProfilLengkap(user.pengguna_id));
}, { auth: true });

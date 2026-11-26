import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { query } from '@/lib/db';
import { route, ok, ApiError } from '@/lib/api';
import { getProfilLengkap } from '@/lib/queries';
import {
  AVATAR_DIR,
  FOTO_URL_PREFIX,
  MAX_FOTO_BYTES,
  deteksiTipeGambar,
  hapusFileFoto,
} from '@/lib/foto';


/**
 * @swagger
 * /api/profil/foto:
 *   post:
 *     summary: Ganti foto profil
 *     tags:
 *     - Profil
 *     description: Unggah foto (JPG, PNG, atau WebP, maks. 2 MB). Foto lama otomatis dihapus.
 *     security:
 *     - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *             - foto
 *             properties:
 *               foto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: Foto diperbarui, mengembalikan profil lengkap
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
export const POST = route(async ({ req, user }) => {
  let form;
  try {
    form = await req.formData();
  } catch {
    throw new ApiError(400, 'Data unggahan tidak valid');
  }
  const file = form.get('foto');
  if (!file || typeof file === 'string' || typeof file.arrayBuffer !== 'function')
    throw new ApiError(400, 'File foto wajib diunggah');
  if (file.size > MAX_FOTO_BYTES) throw new ApiError(400, 'Ukuran foto maksimal 2 MB');

  const buf = Buffer.from(await file.arrayBuffer());
  const tipe = deteksiTipeGambar(buf);
  if (!tipe) throw new ApiError(400, 'Format foto harus JPG, PNG, atau WebP');

  await mkdir(AVATAR_DIR, { recursive: true });
  const nama = `${user.pengguna_id}-${Date.now()}.${tipe.ext}`;
  await writeFile(path.join(AVATAR_DIR, nama), buf);

  const { rows } = await query('SELECT foto_url FROM pengguna WHERE pengguna_id = $1', [user.pengguna_id]);
  await query('UPDATE pengguna SET foto_url = $1 WHERE pengguna_id = $2', [
    FOTO_URL_PREFIX + nama,
    user.pengguna_id,
  ]);
  await hapusFileFoto(rows[0]?.foto_url);

  return ok(await getProfilLengkap(user.pengguna_id));
}, { auth: true });

/**
 * @swagger
 * /api/profil/foto:
 *   delete:
 *     summary: Hapus foto profil
 *     tags:
 *     - Profil
 *     security:
 *     - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Foto dihapus, mengembalikan profil lengkap
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
export const DELETE = route(async ({ user }) => {
  const { rows } = await query('SELECT foto_url FROM pengguna WHERE pengguna_id = $1', [user.pengguna_id]);
  await query('UPDATE pengguna SET foto_url = NULL WHERE pengguna_id = $1', [user.pengguna_id]);
  await hapusFileFoto(rows[0]?.foto_url);
  return ok(await getProfilLengkap(user.pengguna_id));
}, { auth: true });
